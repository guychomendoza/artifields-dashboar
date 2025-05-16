import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';
import { useAuth, type Roles } from 'src/context/AuthContext';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

// import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
    data: {
        path: string;
        title: string;
        icon: React.ReactNode;
        info?: React.ReactNode;
        allowedRole?: Roles[];
    }[];
    slots?: {
        topArea?: React.ReactNode;
        bottomArea?: React.ReactNode;
    };
    workspaces: WorkspacesPopoverProps['data'];
    sx?: SxProps<Theme>;
};

type NavItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    allowedRole?: Roles[];
};

export function NavDesktop({
    sx,
    data,
    slots,
    workspaces,
    layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                py: 2.5,
                px: 2.5,
                top: 0,
                left: 0,
                height: 1,
                display: 'none',
                position: 'fixed',
                flexDirection: 'column',
                bgcolor: 'var(--layout-nav-bg)',
                zIndex: 'var(--layout-nav-zIndex)',
                width: 'var(--layout-nav-vertical-width)',
                borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
                [theme.breakpoints.up(layoutQuery)]: {
                    display: 'flex',
                },
                ...sx,
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Box>
    );
}

// ----------------------------------------------------------------------

export function NavMobile({
    sx,
    data,
    open,
    slots,
    onClose,
    workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    useEffect(() => {
        if (open) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    pt: 2.5,
                    px: 2.5,
                    overflow: 'unset',
                    bgcolor: 'var(--layout-nav-bg)',
                    width: 'var(--layout-nav-mobile-width)',
                    height: '100vh',
                    ...sx,
                },
            }}
        >
            <NavContent data={data} slots={slots} workspaces={workspaces} />
        </Drawer>
    );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
    const pathname = usePathname();
    const { userRole } = useAuth();
    const theme = useTheme();

    // Group routes based on role access with null checks
    const groupedRoutes = {
        user: data.filter((item) => item.allowedRole?.includes('user') ?? false),
        admin: data.filter(
            (item) =>
                (item.allowedRole?.includes('admin') ?? false) &&
                !(item.allowedRole?.includes('user') ?? false)
        ),
        superadmin: data.filter(
            (item) =>
                (item.allowedRole?.includes('superadmin') ?? false) &&
                !(item.allowedRole?.includes('admin') ?? false) &&
                !(item.allowedRole?.includes('user') ?? false)
        ),
    };

    // Helper function to render navigation items
    const renderNavItems = (items: NavItem[]) =>
        items.map((item) => {
            if (item.allowedRole && !item.allowedRole.includes(userRole)) {
                return null;
            }

            const isActived = item.path === pathname;

            return (
                <ListItem disableGutters disablePadding key={item.title}>
                    <ListItemButton
                        disableGutters
                        component={RouterLink}
                        href={item.path}
                        sx={{
                            pl: 2,
                            py: 1,
                            gap: 2,
                            pr: 1.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            fontWeight: 'fontWeightMedium',
                            color: 'var(--layout-nav-item-color)',
                            minHeight: 'var(--layout-nav-item-height)',
                            ...(isActived && {
                                fontWeight: 'fontWeightSemiBold',
                                bgcolor: 'var(--layout-nav-item-active-bg)',
                                color: 'var(--layout-nav-item-active-color)',
                                '&:hover': {
                                    bgcolor: 'var(--layout-nav-item-hover-bg)',
                                },
                            }),
                        }}
                    >
                        <Box component="span" sx={{ width: 24, height: 24 }}>
                            {item.icon}
                        </Box>

                        <Box component="span" flexGrow={1}>
                            {item.title}
                        </Box>

                        {item.info && item.info}
                    </ListItemButton>
                </ListItem>
            );
        });

    const renderSectionTitle = (title: string) => (
        <Typography
            variant="subtitle2"
            sx={{
                px: 2,
                py: 1.5,
                color: theme.palette.text.secondary,
                fontWeight: 'fontWeightBold',
            }}
        >
            {title}
        </Typography>
    );

    return (
        <>
            <Logo />

            {slots?.topArea}

            {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} /> */}

            <Scrollbar fillContent>
                <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
                    <Box component="ul" gap={0.5} display="flex" flexDirection="column">
                        {/* User Routes (always shown) */}
                        {renderNavItems(groupedRoutes.user)}

                        {/* Admin Routes */}
                        {userRole === 'admin' && groupedRoutes.admin.length > 0 && (
                            <>
                                {renderSectionTitle('Admin')}
                                {renderNavItems(groupedRoutes.admin)}
                            </>
                        )}

                        {/* Superadmin Routes */}
                        {userRole === 'superadmin' && (
                            <>
                                {groupedRoutes.admin.length > 0 && (
                                    <>
                                        {renderSectionTitle('Admin')}
                                        {renderNavItems(groupedRoutes.admin)}
                                    </>
                                )}
                                {groupedRoutes.superadmin.length > 0 && (
                                    <>
                                        {renderSectionTitle('Superadmin')}
                                        {renderNavItems(groupedRoutes.superadmin)}
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Scrollbar>

            {slots?.bottomArea}
        </>
    );
}
