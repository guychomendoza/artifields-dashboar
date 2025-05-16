import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Line,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    LineChart,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import {useMediaQuery} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import type { StationLatestData } from '../../../../api-requests/type';

const unitsMapping: Record<string, { unit: string; color: string }> = {
    Humedad: { unit: '%', color: '#8884d8' },
    'Intensidad de la luz': { unit: 'lux', color: '#ffc658' },
    Presión: { unit: 'hPa', color: '#82ca9d' },
    Precipitación: { unit: 'mm', color: '#0088fe' },
    Temperatura: { unit: '°C', color: '#ff7300' },
    UV: { unit: '', color: '#ba68c8' },
    'Velocidad del viento': { unit: 'km/h', color: '#4caf50' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Card elevation={3} sx={{
                p: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {label}
                </Typography>
                <Stack spacing={1}>
                    {payload.map((pld: any) => (
                        <Box key={pld.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: pld.color
                                }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {pld.name}:
                            </Typography>
                            <Typography variant="body2">
                                {pld.value} {unitsMapping[pld.name]?.unit}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Card>
        );
    }
    return null;
};

type HistoryChartProps = {
    measurements: StationLatestData[];
    selectedOptions: string[];
}

export const HistoryChart = ({ measurements = [], selectedOptions = [] }: HistoryChartProps) => {
    const isDesktop = useMediaQuery('(min-width:768px)');

    const chartData = measurements
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((measurement) => ({
            date: format(new Date(measurement.timestamp), 'dd/MM HH:mm', { locale: es }),
            ...selectedOptions.reduce(
                (acc, option) => {
                    const value = measurement[option as keyof StationLatestData];
                    acc[option] = value !== undefined ? parseFloat(String(value)) || 0 : 0;
                    return acc;
                },
                {} as Record<string, number>
            ),
        }));

    const getOptionName = (option: string): string => {
        const nameMapping: Record<string, string> = {
            humidity: 'Humedad',
            light: 'Intensidad de la luz',
            pressure: 'Presión',
            rainfall: 'Precipitación',
            temperature: 'Temperatura',
            uv: 'UV',
            windSpeed: 'Velocidad del viento',
        };
        return nameMapping[option] || option;
    };

    return (
        <Card>
            <CardHeader
                title="Análisis de la estación"
                subheader="Visualice los datos de su estación"
            />
            {selectedOptions.length > 0 ? (
                <CardContent sx={{ height: "400px" }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            margin={isDesktop ?
                                { top: 0, right: 0, left: 0, bottom: 0 } :
                                { top: 0, right: 8, left: 8, bottom: 0 }
                            }
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#666', fontSize: isDesktop ? 12 : 10 }}
                                tickLine={{ stroke: '#666' }}
                                axisLine={{ stroke: '#666' }}
                                interval="preserveStartEnd"
                            />

                            {isDesktop && selectedOptions.map((option, index) => {
                                const optionName = getOptionName(option);
                                const { unit } = unitsMapping[optionName];

                                return (
                                    <YAxis
                                        key={option}
                                        yAxisId={option}
                                        orientation={index % 2 === 0 ? 'left' : 'right'}
                                        tickFormatter={(value) => `${value}${unit}`}
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={{ stroke: '#666' }}
                                        axisLine={{ stroke: '#666' }}
                                        domain={['auto', 'auto']}
                                        width={60}
                                    />
                                );
                            })}

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#f0f0f0' }}
                            />

                            <Legend
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{
                                    paddingTop: '10px',
                                    fontSize: isDesktop ? '12px' : '10px'
                                }}
                                iconType="circle"
                                iconSize={isDesktop ? 10 : 8}
                            />

                            {selectedOptions.map((option) => {
                                const optionName = getOptionName(option);
                                const { color } = unitsMapping[optionName];

                                return (
                                    <Line
                                        key={option}
                                        yAxisId={option}
                                        type="monotone"
                                        dataKey={option}
                                        name={optionName}
                                        stroke={color}
                                        dot={false}
                                        strokeWidth={2}
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            ) : (
                <CardContent>
                    <Typography variant="body1" color="textSecondary">
                        No hay datos disponibles para las opciones seleccionadas.
                    </Typography>
                </CardContent>
            )}
        </Card>
    );
};