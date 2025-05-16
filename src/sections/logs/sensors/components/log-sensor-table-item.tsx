import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReactJsonView from 'react-json-view';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import type { SensorLog } from '../../../../api-requests/logs/schema';

type LogSensorTableProps = {
    logSensor: SensorLog;
    idx: number;
};

export const LogSensorTable = ({ logSensor, idx }: LogSensorTableProps) => {
    const getParsedJson = () => {
        try {
            return JSON.parse(logSensor.json);
        } catch (e) {
            return {};
        }
    };

    const date = new Date(logSensor.hora);
    const formattedDate = format(date, "d 'de' MMMM 'de' yyyy 'a las' h:mm a", { locale: es });
    const parssedJson = getParsedJson();

    return (
        <TableRow
            style={{
                backgroundColor: idx % 2 === 0 ? "rgba(255,255,255)" : "rgba(250,250,250)"
            }}
        >
            <TableCell>{logSensor.id}</TableCell>
            <TableCell>{logSensor.title}</TableCell>
            <TableCell>
                <ReactJsonView
                    src={parssedJson}
                    theme="rjv-default"
                    displayDataTypes={false}
                    indentWidth={2}
                    collapseStringsAfterLength={30}
                    displayObjectSize
                    enableClipboard={false}
                    collapsed
                />
            </TableCell>
            <TableCell>{formattedDate}</TableCell>
        </TableRow>
    );
};