import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { useSensor } from 'src/store/sensor';

import { Iconify } from 'src/components/iconify';

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

export const SoilMoisture = () => {
    const { selectedMeasurement } = useSensor();

    // Ensure values are defined
    const lowerLimit = selectedMeasurement?.sensorInfo.limite_inferior ?? 0;
    const upperLimit = selectedMeasurement?.sensorInfo.limite_superior ?? 100;
    const idealValue = selectedMeasurement?.sensorInfo.capacidadIdeal
        ? Number(selectedMeasurement.sensorInfo.capacidadIdeal)
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
                height: {
                    xs: '300px',
                    lg: '100%',
                },
            }}
        >
            <CardHeader
                title="Humedad"
                sx={{
                    padding: 1.5,
                    paddingBottom: 0,
                }}
                titleTypographyProps={{
                    variant: 'body1',
                    fontWeight: 'medium',
                }}
                avatar={<Iconify icon="solar:waterdrops-line-duotone" />}
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
                position="relative"
                sx={{
                    paddingLeft: 8,
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
                        {value: normalizedValue(idealValue), label: selectedMeasurement?.sensorInfo.capacidadIdeal ? `${selectedMeasurement?.sensorInfo.capacidadIdeal}%` : ""},
                        { value: 100, label: `${sliderMax}%` },
                    ].filter(Boolean)} // Filter out null marks
                    orientation="vertical"
                    value={
                        selectedMeasurement?.ultimaMedicion?.agua_suelo
                            ? normalizedValue(Number(selectedMeasurement.ultimaMedicion.agua_suelo))
                            : 0
                    }
                    valueLabelFormat={() => selectedMeasurement?.ultimaMedicion.agua_suelo}
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
};
