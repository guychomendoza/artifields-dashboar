import { useState } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';

import { Iconify } from '../../components/iconify';

export const MobileSortingControls = ({
    requestSort,
    getSortDirection,
}: {
    requestSort: (key: string, direction: 'asc' | 'desc') => void;
    getSortDirection: (key: string) => string | null;
}) => {
    const [sortField, setSortField] = useState('deviceName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortOptions = [
        { value: 'deviceName', label: 'Nombre' },
        { value: 'lastMeasurement.soilWater', label: 'Humedad' },
        { value: 'lastMeasurement.soilConductivity', label: 'Conductividad' },
        { value: 'lastMeasurement.soilTemperature', label: 'Temperatura' },
        { value: 'lastMeasurement.battery', label: 'Batería' },
        { value: 'lastMeasurement.timestamp', label: 'Última Actualización' },
    ];

    const handleSort = () => {
        requestSort(sortField, sortDirection);
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Campo</InputLabel>
                <Select
                    value={sortField}
                    label="Campo"
                    onChange={(e) => setSortField(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Dirección</InputLabel>
                <Select
                    value={sortDirection}
                    label="Dirección"
                    onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                >
                    <MenuItem value="asc">Ascendente</MenuItem>
                    <MenuItem value="desc">Descendente</MenuItem>
                </Select>
            </FormControl>

            <IconButton onClick={handleSort}>
                <Iconify icon="solar:round-sort-vertical-line-duotone" width={32} color="#1877f2" />
            </IconButton>
        </Box>
    );
};
