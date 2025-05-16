import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import CardHeader from '@mui/material/CardHeader';

type Props = CardProps & {
    title?: string;
    colors: string[];
    percent: number;
    formatTextValue?: (value: string) => string;
    icon?: React.ReactNode;
    temperature?: string;
};

export function SoilTemperature({
   title,
   colors,
   percent,
   formatTextValue,
   icon,
   temperature = '0', // Default to 0 if no temperature is provided
   ...other
}: Props) {
    // Parse temperature and calculate limits
    const tempValue = parseFloat(temperature);
    const lowerLimit = 0;
    const upperLimit = 50;

    const normalizedValue = (value: number|null) => {
        if (!value) return 0;
        return ((value - lowerLimit) / (upperLimit - lowerLimit)) * 100;
    }

    return (
        <Card
            {...other}
            sx={{
                width: '100%',
                height: {
                    xs: '300px',
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

            <Box
                px={3}
                height={{
                    xs: 'calc(100% - 4rem)',
                    lg: 'calc(100% - 3rem)',
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    paddingLeft: 8,
                }}
            >
                <Slider
                    track={false}
                    marks={[
                        { value: 0, label: `${lowerLimit}°c` },
                        { value: 100, label: `${upperLimit}°c` },
                    ]}
                    disabled
                    orientation="vertical"
                    valueLabelDisplay="on"
                    value={normalizedValue(tempValue)}
                    valueLabelFormat={() => `${tempValue}°c`} // Show actual temperature with 1 decimal place
                    sx={{
                        height: '90%',
                        width: 8,
                        '& .MuiSlider-rail': {
                            background: `linear-gradient(to top, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                            opacity: 1,
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            width: 16,
                            height: 16,
                        },
                    }}
                />
            </Box>
        </Card>
    );
}
