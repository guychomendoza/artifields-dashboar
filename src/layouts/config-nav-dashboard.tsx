import { type Roles } from 'src/context/AuthContext';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

import { Iconify } from '../components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
    <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

type NavItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    allowedRole: Roles[];
};

export const navData: NavItem[] = [
    {
        title: 'Mis dispositivos',
        path: '/assigned-sensors',
        icon: <Iconify icon="solar:devices-bold-duotone" />,
        allowedRole: ['user', 'admin', 'superadmin'],
    },
    {
        title: 'Clima',
        path: '/forecast',
        icon: <Iconify icon="solar:cloud-sun-bold-duotone" />,
        allowedRole: ['user', 'admin', 'superadmin'],
    },
    {
        title: 'Proyectos',
        path: '/projects',
        icon: <Iconify icon="si:projects-duotone" />,
        allowedRole: ['admin', 'superadmin'],
    },
    {
        title: 'Mapa',
        path: '/map',
        icon: <Iconify icon="solar:map-bold-duotone" />,
        allowedRole: ['admin', 'superadmin'],
    },
    {
        title: 'Reporte de sensores',
        path: '/sensors-report',
        icon: <Iconify icon="solar:document-add-bold-duotone" />,
        allowedRole: ['admin', 'superadmin'],
    },
    {
        title: 'Sensores',
        path: '/sensors',
        icon: <Iconify icon="duo-icons:chip" />,
        allowedRole: ['admin', 'superadmin'],
    },
    {
        title: 'Registrar',
        path: '/register',
        icon: <Iconify icon="duo-icons:user" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'Usuarios',
        path: '/users',
        icon: <Iconify icon="ph:users-four-duotone" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'CMS',
        path: '/cms',
        icon: <Iconify icon="si:dashboard-customize-duotone" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'Logs',
        path: '/logs',
        icon: <Iconify icon="icon-park-twotone:data-one" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'WhatsApp',
        path: '/whatsapp',
        icon: <Iconify icon="mingcute:whatsapp-fill" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'Webhooks',
        path: '/webhooks',
        icon: <Iconify icon="ph:webhooks-logo-duotone" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'Alertas',
        path: '/alerts',
        icon: <Iconify icon="si:alert-duotone" />,
        allowedRole: ['superadmin'],
    },
    {
        title: 'Emails',
        path: '/emails',
        icon: <Iconify icon="si:mail-duotone" />,
        allowedRole: ['superadmin'],
    },
];
