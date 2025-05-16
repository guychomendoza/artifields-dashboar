import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSensor } from 'src/store/sensor';

import { formatTimestamp } from './utils';

export const SensorDetails = () => {
    const { selectedMeasurement } = useSensor();

    return (
        <Stack
            direction={{
                xs: 'column',
                sm: 'row',
            }}
            gap={{
                xs: 1,
                sm: 4,
            }}
            mt={3}
        >
            {/* <Stack direction="column">
            <Typography variant="subtitle1">Numero de serie</Typography>
            <Typography variant="body2">FKLO9076GJNGGTRF1PO</Typography>
        </Stack> */}

            <Stack direction="column">
                <Typography variant="subtitle1">Ultima actualizacion</Typography>
                <Typography variant="body2">
                    {formatTimestamp(selectedMeasurement?.ultimaMedicion.timestamp)}
                </Typography>
            </Stack>
        </Stack>
    );
};
