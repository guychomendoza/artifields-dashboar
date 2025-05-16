import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

type Props = CardProps & {
    title?: string;
    value: number;
    units?: string;
    icon?: React.ReactNode;
};

export const AnalyticsCard = ({ title, units, value, icon, ...other }: Props) => (
    <Card
        {...other}
        sx={{
            width: '100%',
            height: {
                xs: '200px',
                lg: '100%',
            },
        }}
    >
        <CardHeader
            title={title}
            sx={{
                padding: 1.5,
                paddingBottom: 0,
            }}
            titleTypographyProps={{
                variant: 'body1',
                fontWeight: 'medium',
            }}
            avatar={icon}
        />

        <CardContent
            sx={{
                padding: 1.5,
            }}
        >
            <Typography variant="h6">
                {value}{' '}
                <Typography variant="body2" color="textSecondary" component="span">
                    {units}
                </Typography>
            </Typography>
        </CardContent>
    </Card>
);
