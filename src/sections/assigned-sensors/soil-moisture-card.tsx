import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import {formatTimestamp} from "../iot/utils";

// Create a styled component for the reference line and value
const ReferenceLine = styled('div')(() => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    right: 0,
    transform: 'translateY(-50%)',
}));

const ReferenceLineMarker = styled('div')(({ color }) => ({
    width: '3rem',
    borderTop: `2px dashed ${color}`,
}));

const ReferenceValue = styled('span')(({ color }) => ({
    marginLeft: '8px',
    fontSize: '0.75rem',
    color,
}));

type SoilMoistureCardProps = {
    bottomLimit: string | null;
    topLimit: string | null;
    soilMoisture: string | null;
    name: string | null;
    lastMeasurement: string | null;
    desiredValue: string | null;
    deviceId: string;
}

export function SoilMoistureCard({ bottomLimit, topLimit, soilMoisture, lastMeasurement, name, desiredValue, deviceId }: SoilMoistureCardProps) {

    // Ensure values are defined
    const lowerLimit = bottomLimit ? Number(bottomLimit) : 0;
    const upperLimit = topLimit ? Number(topLimit) : 100;
    const idealValue = desiredValue
        ? Number(desiredValue)
        : null;

    const sliderMin = 10;
    const sliderMax = 50;

    const normalizedValue = (value: number|null) => {
        if (!value) return 0;
        return ((value - sliderMin) / (sliderMax - sliderMin)) * 100;
    }

    const thresholdLines = [
        {
            value: normalizedValue(lowerLimit),
            color: '#ff0000',
            label: `${lowerLimit}`,
            condition: lowerLimit >= sliderMin,
        },
        {
            value: normalizedValue(upperLimit),
            color: '#0b2af1',
            label: `${upperLimit}`,
            condition: upperLimit <= sliderMax,
        },
    ].filter(({ condition }) => condition);


    return (
        <Card
            sx={{
                width: '100%',
                position: 'relative',
                height: '100%',
            }}
        >
            <CardHeader
                title={
                <Tooltip title={deviceId}>
                    <Typography fontWeight="500">
                        {name || "sin nombre"}
                    </Typography>
                </Tooltip>
                }
                subheader={
                    `${formatTimestamp(lastMeasurement)}`
                }
                sx={{
                    padding: 1.5,
                    paddingBottom: 0,
                }}
                titleTypographyProps={{
                    variant: 'body1',
                    fontWeight: 'medium',
                }}
                subheaderTypographyProps={{
                    variant: 'body2',
                    fontSize: '0.75rem',
                }}
                avatar={<Iconify icon="solar:waterdrops-line-duotone" />}
            />

            <Box
                px={3}
                height={200}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                my={2}
                sx={{
                    paddingLeft: 8
                }}
            >
                <Box
                    position="absolute"
                    height="90%"
                    right="30%"
                    sx={{ transform: 'translateX(12px)' }}
                >
                    {thresholdLines.map(({ value, color, label }) => (
                        <Box
                            key={label}
                            position="absolute"
                            style={{
                                bottom: `${value}%`,
                                width: '100%',
                            }}
                        >
                            <ReferenceLine color={color}>
                                <ReferenceLineMarker color={color} />
                                <ReferenceValue color={color}>{label}</ReferenceValue>
                            </ReferenceLine>
                        </Box>
                    ))}
                </Box>

                <Slider
                    track={false}
                    marks={[
                        { value: 0, label: `${sliderMin}%` },
                        {value:  normalizedValue(idealValue), label: desiredValue ? `${desiredValue}%` : ""},
                        { value: 100, label: `${sliderMax}%` },
                    ].filter(Boolean)} // Filter out null marks
                    orientation="vertical"
                    value={
                        soilMoisture
                            ? normalizedValue(Number(soilMoisture))
                            : 0
                    }
                    valueLabelFormat={() => soilMoisture}
                    disabled
                    valueLabelDisplay="on"
                    sx={{
                        height: '90%',
                        width: 8,
                        '& .MuiSlider-rail': {
                            background: `linear-gradient(to top, #f10b0b, #f1ee0b, #0b2af1)`,
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
