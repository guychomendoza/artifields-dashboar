import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import {formatTimestamp} from "../../iot/utils";
import {normalizeSliderValue} from "../../../utils/charts";

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
    bottomLimit?: number | null;
    topLimit?: number | null;
    soilMoisture?: number | null;
    name: string;
    lastMeasurement?: string | null;
    desiredValue?: number | null;
    deviceId: string;
}

export const SoilMoistureCard = ({
    bottomLimit = null,
    topLimit = null,
    soilMoisture,
    lastMeasurement,
    name,
    desiredValue,
    deviceId
}: SoilMoistureCardProps) => {
    const sliderMin = 10;
    const sliderMax = 50;

    const thresholdLines = [
        bottomLimit ? {
            value: normalizeSliderValue(bottomLimit, sliderMax, sliderMin),
            color: '#ff0000',
            label: `${bottomLimit}`,
            condition: bottomLimit >= sliderMin,
        }: {},
        topLimit ? {
            value: normalizeSliderValue(topLimit, sliderMax, sliderMin),
            color: '#0b2af1',
            label: `${topLimit}`,
            condition: topLimit <= sliderMax,
        }: {},
    ].filter((line): line is NonNullable<typeof line> => Boolean(line?.condition));

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
                {thresholdLines.length > 0 && (
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
                )}

                {soilMoisture !== null && soilMoisture !== undefined ? (
                    <Slider
                        track={false}
                        marks={[
                            { value: 0, label: `${sliderMin}%` },
                            desiredValue ? {
                                value: normalizeSliderValue(desiredValue, sliderMax, sliderMin),
                                label: `${desiredValue}%`
                            } : { value: 0 },
                            { value: 100, label: `${sliderMax}%` },
                        ].filter(Boolean)}
                        orientation="vertical"
                        value={normalizeSliderValue(soilMoisture, sliderMax, sliderMin)}
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
                            '& .MuiSlider-valueLabel': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                borderColor: 'white',
                                border: '1px solid #EBEBEB'
                            }
                        }}
                    />
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ marginRight: 8 }}>
                        Sin datos
                    </Typography>
                )}
            </Box>
        </Card>
    );
}