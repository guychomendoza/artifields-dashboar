import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";

import {SortableTableCell} from "../../../../layouts/table/sortable-table-cell";

import type {SortDirection} from "../../../../hooks/use-filter-table";

type StationTableHeaderProps = {
    requestSort: (key: string, ) => void
    getSortDirection:  (key: string) => SortDirection
}

export const StationTableHeader = ({
    requestSort,
    getSortDirection
}: StationTableHeaderProps) => (
    <TableHead>
        <TableRow>
            <TableCell>Acciones</TableCell>
            <TableCell>Id</TableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.deviceName">Nombre del Dispositivo</SortableTableCell>
            <TableCell>Nombre del grupo</TableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.temperature">Temperatura</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.humidity">Humedad</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.light">Intensidad de la luz</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.uv">UV</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.windSpeed">Velocidad del viento</SortableTableCell>
            <TableCell>Dirección del viento</TableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.rainfall">Precipitación</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.pressure">Presión</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.rssi">rssi</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.snr">snr</SortableTableCell>
            <SortableTableCell requestSort={requestSort} getSortDirection={getSortDirection} sortKey="latestData.timestamp">Última actualización</SortableTableCell>
        </TableRow>
    </TableHead>
)