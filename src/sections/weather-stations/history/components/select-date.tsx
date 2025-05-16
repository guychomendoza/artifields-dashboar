import 'react-day-picker/dist/style.css';

import type { SelectChangeEvent } from '@mui/material';

import { useMemo, useState, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { subWeeks, subYears, endOfDay, subMonths, startOfDay, isWithinInterval } from 'date-fns';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import type {StationLatestData} from "../../../../api-requests/type";

type TimeRangeValue = '1w' | '2w' | '1m' | '6m' | '1y' | 'custom';

interface PresetOption {
    label: string;
    value: TimeRangeValue;
}

interface SelectDateProps {
    measurements: StationLatestData[];
    onRangeChange: (dateRange: [Date, Date]) => void;
}

export const SelectDate = ({ measurements, onRangeChange }: SelectDateProps) => {
    // Convert UTC timestamps to local dates
    const { oldestDate, newestDate } = useMemo(() => {
        const dates = measurements
            ?.map((m) => (m.timestamp ? new Date(m.timestamp) : null))
            ?.filter((date): date is Date => date !== null);

        return {
            oldestDate: startOfDay(new Date(Math.min(...dates.map((date) => date.getTime())))),
            newestDate: endOfDay(new Date(Math.max(...dates.map((date) => date.getTime())))),
        };
    }, [measurements]);

    const presetOptions = useMemo(() => {
        const options: PresetOption[] = [];
        const now = newestDate;

        // Ensure we're working with local dates for comparison
        if (isWithinInterval(subWeeks(now, 1), { start: oldestDate, end: now })) {
            options.push({ label: '1 Semana', value: '1w' });
        }
        if (isWithinInterval(subWeeks(now, 2), { start: oldestDate, end: now })) {
            options.push({ label: '2 Semanas', value: '2w' });
        }
        if (isWithinInterval(subMonths(now, 1), { start: oldestDate, end: now })) {
            options.push({ label: '1 Mes', value: '1m' });
        }
        if (isWithinInterval(subMonths(now, 6), { start: oldestDate, end: now })) {
            options.push({ label: '6 Meses', value: '6m' });
        }
        if (isWithinInterval(subYears(now, 1), { start: oldestDate, end: now })) {
            options.push({ label: '1 Año', value: '1y' });
        }
        options.push({ label: 'Rango Personalizado', value: 'custom' });

        return options;
    }, [oldestDate, newestDate]);

    const [selectedPreset, setSelectedPreset] = useState<TimeRangeValue>(presetOptions[0]?.value);
    const [dateRange, setDateRange] = useState<DateRange>({ from: oldestDate, to: newestDate });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (!presetOptions[0]) return;

        // Set initial range to last week, using local time
        const initialEndDate = endOfDay(newestDate);
        const initialStartDate = startOfDay(subWeeks(initialEndDate, 1));

        setSelectedPreset(presetOptions[0].value);
        onRangeChange([initialStartDate, initialEndDate]);
        setDateRange({ from: initialStartDate, to: initialEndDate });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePresetChange = (event: SelectChangeEvent<TimeRangeValue>) => {
        const value = event.target.value as TimeRangeValue;
        setSelectedPreset(value);

        if (value === 'custom') return;

        let startDate = startOfDay(newestDate);
        const endDate = endOfDay(newestDate);

        switch (value) {
            case '1w':
                startDate = startOfDay(subWeeks(newestDate, 1));
                break;
            case '2w':
                startDate = startOfDay(subWeeks(newestDate, 2));
                break;
            case '1m':
                startDate = startOfDay(subMonths(newestDate, 1));
                break;
            case '6m':
                startDate = startOfDay(subMonths(newestDate, 6));
                break;
            case '1y':
                startDate = startOfDay(subYears(newestDate, 1));
                break;
            default:
                break;
        }

        const newRange: DateRange = { from: startDate, to: endDate };
        setDateRange(newRange);
        onRangeChange([startDate, endDate]);
    };

    const handleCustomRangeChange = (newRange: DateRange) => {
        if (newRange.from && newRange.to) {
            // Ensure full day ranges in local time
            const startDate = startOfDay(newRange.from);
            const endDate = endOfDay(newRange.to);

            const adjustedRange: DateRange = { from: startDate, to: endDate };
            setDateRange(adjustedRange);
            setSelectedPreset('custom');
            onRangeChange([startDate, endDate]);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Stack
            className="flex flex-col gap-4 p-4"
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent={{ xs: 'stretch', sm: 'start' }}
            spacing={2}
            mb={2}
        >
            <FormControl className="min-w-[200px]">
                <InputLabel>Rango de Tiempo</InputLabel>
                <Select
                    value={selectedPreset}
                    label="Rango de Tiempo"
                    onChange={handlePresetChange}
                    size="small"
                >
                    {presetOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedPreset === 'custom' && (
                <>
                    <Button variant="outlined" onClick={handleClick}>
                        Seleccionar Rango de Fechas
                    </Button>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        sx={{ '& .MuiPopover-paper': { p: 2 } }}
                    >
                        <DayPicker
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => handleCustomRangeChange(range as DateRange)}
                            disabled={{ before: oldestDate, after: newestDate }}
                            showOutsideDays
                        />
                    </Popover>
                </>
            )}
        </Stack>
    );
};
