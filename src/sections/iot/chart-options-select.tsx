import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Label from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import { AlertTitle, useMediaQuery } from '@mui/material';

const CHART_OPTIONS = [
    { key: 'temperatura_suelo', label: 'Temperatura del Suelo' },
    { key: 'bateria', label: 'Batería' },
    { key: 'conductividad_suelo', label: 'Conductividad del Suelo' },
    { key: 'agua_suelo', label: 'Humedad del Suelo' },
];

const MAX_MOBILE_OPTIONS = 2;

export const ChartOptionsSelect = ({
    selectedOptions,
    setSelectedOptions,
}: {
    selectedOptions: string[];
    setSelectedOptions: (selectedOptions: string[]) => void;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
    <Card
        sx={{
            mt: 2,
        }}
    >
        <CardContent>
            {isMobile && selectedOptions.length >= MAX_MOBILE_OPTIONS && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Recomendación de visualización</AlertTitle>
                    No se recomienda ver muchos ejes simultáneamente en teléfonos móviles.
                    Para una mejor experiencia con múltiples ejes, utilice una tablet o computadora.
                </Alert>
            )}

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
)}
