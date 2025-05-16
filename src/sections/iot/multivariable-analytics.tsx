import type { Sensor } from 'src/api-requests/type';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useMemo, useState } from 'react';
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

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { useTheme, useMediaQuery } from '@mui/material';

import { Iconify } from '../../components/iconify';

const unitsMapping: Record<string, { unit: string; color: string }> = {
    'Temperatura del Suelo': { unit: '°C', color: '#2E93fA' },
    'Humedad del Suelo': { unit: '%', color: '#66DA26' },
    'Conductividad del Suelo': { unit: 'uS/cm', color: '#546E7A' },
    Batería: { unit: '%', color: '#E91E63' },
};

const optionNameMapping: Record<string, string> = {
    temperatura_suelo: 'Temperatura del Suelo',
    bateria: 'Batería',
    conductividad_suelo: 'Conductividad del Suelo',
    agua_suelo: 'Humedad del Suelo',
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Card
                elevation={3}
                sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
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
                                    backgroundColor: pld.color,
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

interface MultivariableAnalyticsProps {
    measurements: Sensor[];
    selectedOptions: string[];
}

export const MultivariableAnalytics = ({
    measurements = [],
    selectedOptions = [],
}: MultivariableAnalyticsProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery('(min-width:768px)');
    const isMobile = useMediaQuery('(max-width:767px)');
    const [selectedPoints, setSelectedPoints] = useState<Record<string, number | string>[]>([]);

    // Process chart data - now showing all data points for both mobile and desktop
    const chartData = useMemo(() => {
        const sortedMeasurements = [...measurements].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return sortedMeasurements.map((measurement) => ({
            timestamp: measurement.timestamp,
            date: format(new Date(measurement.timestamp), 'dd/MM HH:mm', { locale: es }),
            ...selectedOptions.reduce(
                (acc, option) => {
                    const value = measurement[option as keyof Sensor];
                    acc[optionNameMapping[option]] =
                        value !== undefined ? parseFloat(String(value)) || 0 : 0;
                    return acc;
                },
                {} as Record<string, number>
            ),
        }));
    }, [measurements, selectedOptions]);

    const handleChartClick = (event: any) => {
        if (event && event.activePayload && event.activePayload.length > 0) {
            const pointData: Record<string, number | string> = {};
            event.activePayload.forEach((payload: any) => {
                pointData[payload.name] = payload.value;
            });
            pointData.date = event.activeLabel;

            // @ts-ignore
            setSelectedPoints((prevPoints) => [...prevPoints, pointData]);
        }
    };

    const handleRemovePoint = (indexToRemove: number) => {
        setSelectedPoints((prevPoints) => prevPoints.filter((_, index) => index !== indexToRemove));
    };

    const updatedSelectedPoints = useMemo(
        () =>
            selectedPoints.map((point) => {
                const matchingMeasurement = measurements.find(
                    (m) =>
                        format(new Date(m.timestamp), 'dd/MM HH:mm', { locale: es }) ===
                        point.date.toString()
                );

                if (matchingMeasurement) {
                    selectedOptions.forEach((option) => {
                        const optionName = optionNameMapping[option];
                        const value = matchingMeasurement[option as keyof Sensor];
                        point[optionName] =
                            value !== undefined ? parseFloat(String(value)) || 0 : 0;
                    });
                }
                return point;
            }),
        [selectedPoints, selectedOptions, measurements]
    );

    return (
        <Card>
            <CardHeader
                title="Análisis de Datos del Sensor"
                subheader="Visualice los datos de su sensor"
            />
            <Grid container spacing={1} sx={{ p: 1 }}>
                {updatedSelectedPoints.map((point, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card elevation={2} sx={{ position: 'relative' }}>
                            <IconButton
                                aria-label="remove point"
                                size="small"
                                sx={{ position: 'absolute', top: 4, right: 4 }}
                                onClick={() => handleRemovePoint(index)}
                            >
                                <Iconify icon="ic:round-close" />
                            </IconButton>
                            <CardContent>
                                <Typography variant="caption" sx={{ fontWeight: 'semibold' }}>
                                    {format(
                                        new Date(
                                            measurements.find(
                                                (m) =>
                                                    format(new Date(m.timestamp), 'dd/MM HH:mm', {
                                                        locale: es,
                                                    }) === point.date
                                            )?.timestamp || new Date()
                                        ),
                                        'dd/MM/yyyy HH:mm',
                                        { locale: es }
                                    )}
                                </Typography>
                                <Stack spacing={0.5}>
                                    {Object.entries(point)
                                        .filter(([key]) => key !== 'date')
                                        .map(([key, value]) => (
                                            <Typography
                                                key={key}
                                                variant="caption"
                                                sx={{ fontWeight: 'normal' }}
                                            >
                                                {key}: {value} {unitsMapping[key]?.unit}
                                            </Typography>
                                        ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedOptions.length > 0 ? (
                <CardContent
                    sx={{
                        height: isMobile ? '400px' : '500px',
                        p: 0,
                        px: 2,
                    }}
                >
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            margin={
                                isDesktop
                                    ? { top: 5, right: 5, left: 5, bottom: 15 }
                                    : { top: 0, right: 0, left: 0, bottom: 0 }
                            }
                            onClick={handleChartClick}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={theme.palette.divider}
                                vertical={isDesktop}
                            />
                            {/* X-Axis with conditionally hidden labels for mobile */}
                            <XAxis
                                dataKey="date"
                                tick={
                                    isDesktop
                                        ? {
                                              fill: theme.palette.text.secondary,
                                              fontSize: 12,
                                          }
                                        : false
                                }
                                tickLine={isDesktop ? { stroke: theme.palette.divider } : false}
                                axisLine={{ stroke: theme.palette.divider }}
                                interval={isDesktop ? 'preserveStartEnd' : 0}
                                height={isDesktop ? 80 : 10}
                                angle={-45}
                            />

                            {/* Y-Axes with conditionally hidden labels for mobile */}
                            {selectedOptions.map((option, index) => {
                                const optionName = optionNameMapping[option];
                                const { unit } = unitsMapping[optionName];

                                return (
                                    <YAxis
                                        key={option}
                                        yAxisId={option}
                                        orientation={index % 2 === 0 ? 'left' : 'right'}
                                        tickFormatter={(value) => `${value}${unit}`}
                                        tick={
                                            isDesktop
                                                ? {
                                                      fill: theme.palette.text.secondary,
                                                      fontSize: 12,
                                                  }
                                                : {
                                                      fill: theme.palette.text.secondary,
                                                      fontSize: 10,
                                                  }
                                        }
                                        tickLine={{ stroke: theme.palette.divider }}
                                        axisLine={{ stroke: theme.palette.divider }}
                                        domain={['auto', 'auto']}
                                        width={isDesktop ? 80 : 50}
                                    />
                                );
                            })}

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: theme.palette.divider }}
                            />

                            {/* Legend always in horizontal layout */}
                            <Legend
                                verticalAlign="top"
                                height={isMobile ? 40 : 36}
                                wrapperStyle={{
                                    paddingTop: '10px',
                                    fontSize: isDesktop ? '12px' : '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                }}
                                iconType="circle"
                                iconSize={isDesktop ? 10 : 8}
                                layout="horizontal"
                            />

                            {selectedOptions.map((option) => {
                                const optionName = optionNameMapping[option];
                                const { color } = unitsMapping[optionName];

                                return (
                                    <Line
                                        key={option}
                                        yAxisId={option}
                                        type="monotone"
                                        dataKey={optionName}
                                        name={optionName}
                                        stroke={color}
                                        connectNulls
                                        // @ts-ignore
                                        dot={(dotProps) => {
                                            // Show only selected dots for clarity
                                            const { cx, cy, payload } = dotProps;
                                            const isSelected = selectedPoints.some(
                                                (point) =>
                                                    point.date === payload.date &&
                                                    point[optionName] === payload[optionName]
                                            );

                                            if (isSelected) {
                                                return (
                                                    <circle
                                                        cx={cx}
                                                        cy={cy}
                                                        r={isDesktop ? 4 : 3}
                                                        fill="white"
                                                        stroke={color}
                                                        strokeWidth={2}
                                                    />
                                                );
                                            }

                                            // Don't show regular dots for cleaner look with full data
                                            return null;
                                        }}
                                        strokeWidth={isMobile ? 1.5 : 2}
                                        activeDot={{ r: isDesktop ? 4 : 3, strokeWidth: 0 }}
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
