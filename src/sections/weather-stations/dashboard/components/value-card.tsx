import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '../../../../components/iconify';

type ValueCardProps = {
    icon: string;
    title: string;
    value?: number;
    units: string;
};

export const ValueCard = ({ icon, title, value, units }: ValueCardProps) => (
    <Card sx={{padding: 2}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={2}>
                <Iconify icon={icon} />
                <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                    {title}
                </Typography>
            </Stack>

            <Typography variant="subtitle2">
                {
                    value ? `${value} ${units}` : "Sin información"
                }
            </Typography>
        </Stack>
    </Card>
);
