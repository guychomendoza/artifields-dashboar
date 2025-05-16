import type { Sensor } from 'src/api-requests/type';

import { useState } from 'react';

import Box from '@mui/material/Box';

import { useSensor } from 'src/store/sensor';

import { DateRangeSelector } from './date-range-selector';
import { ChartOptionsSelect } from './chart-options-select';
import { MultivariableAnalytics } from './multivariable-analytics';

export const DeviceAnalytics = () => {
    const { allMeasurements } = useSensor();
    const [sensorsMeasurements, setSensorsMeasurements] = useState<Sensor[]>([]);
    const [selectedSensorOption, setSelectedSensorOption] = useState<string[]>([]);

    const handleRangeChange = (dateRange: [Date, Date]) => {
        const [startDate, endDate] = dateRange;
        const filteredMeasurements = allMeasurements.filter((measurement) => {
            const measurementDate = new Date(measurement.timestamp);
            return measurementDate >= startDate && measurementDate <= endDate;
        });

        setSensorsMeasurements(filteredMeasurements);
    };

    return (
        <Box>
            <DateRangeSelector measurements={allMeasurements} onRangeChange={handleRangeChange} />
            <MultivariableAnalytics
                measurements={sensorsMeasurements}
                selectedOptions={selectedSensorOption}
            />
            <ChartOptionsSelect
                selectedOptions={selectedSensorOption}
                setSelectedOptions={setSelectedSensorOption}
            />
        </Box>
    );
};
