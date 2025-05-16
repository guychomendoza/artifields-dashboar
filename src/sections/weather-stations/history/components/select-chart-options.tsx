import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Label from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import CardContent from '@mui/material/CardContent';

const CHART_OPTIONS = [
    { key: 'humidity', label: 'Humedad' },
    { key: 'light', label: 'Intensidad de la luz' },
    { key: 'pressure', label: 'Presión' },
    { key: 'rainfall', label: 'Precipitación' },
    { key: 'temperature', label: 'Temperatura' },
    { key: 'uv', label: 'UV' },
    { key: 'windSpeed', label: 'Velocidad del viento' },
];

export const SelectChartOptions = ({
   selectedOptions,
   setSelectedOptions,
}: {
    selectedOptions: string[];
    setSelectedOptions: (selectedOptions: string[]) => void;
}) => (
    <Card
        sx={{
            mt: 2,
        }}
    >
        <CardContent>
            {CHART_OPTIONS.map((option) => (
                <Stack direction="row" spacing={1} key={option.key} alignItems="center">
                    <Checkbox
                        checked={selectedOptions.includes(option.key)}
                        onChange={() => {
                            setSelectedOptions(
                                selectedOptions.includes(option.key)
                                    ? selectedOptions.filter(
                                        (selectedOption) => selectedOption !== option.key
                                    )
                                    : [...selectedOptions, option.key]
                            );
                        }}
                    />
                    <Label>{option.label}</Label>
                </Stack>
            ))}
        </CardContent>
    </Card>
);
