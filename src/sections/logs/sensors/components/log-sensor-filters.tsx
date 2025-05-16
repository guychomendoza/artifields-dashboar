import type {SelectChangeEvent} from "@mui/material";

import {useState, useEffect} from "react";

import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import {useDebounce} from "../../../../hooks/use-debounce";

type LogSensorFiltersProps = {
    setTitleFilter: (titleFilter: string) => void;
    setJsonFilter: (jsonFilter: string) => void;
    setPage: (page: number) => void;
}

export const LogSensorFilters = ({
    setTitleFilter,
    setJsonFilter,
    setPage,
}: LogSensorFiltersProps) => {
    const [selectValue, setSelectValue] = useState("");

    const [textValue, setTextValue] = useState("");
    const debouncedCustomTextValue = useDebounce(textValue, 500);

    const [jsonValue, setJsonValue] = useState("");
    const debouncedJsonValue = useDebounce(jsonValue, 500);

    useEffect(() => {
        setTitleFilter(debouncedCustomTextValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedCustomTextValue]);

    useEffect(() => {
        setJsonFilter(debouncedJsonValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedJsonValue]);

    const onSelectChange = (event: SelectChangeEvent) => {
        const {value} = event.target;
        setSelectValue(value);

        if (value === "custom") return;

        setTitleFilter(value);
        setPage(1);
    };

    return (
        <>
            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={1}
            >
                <Select
                    value={selectValue}
                    onChange={onSelectChange}
                    size="small"
                    fullWidth
                >
                    <MenuItem value="/api/weather-data">/api/weather-data</MenuItem>
                    <MenuItem value="/api/sensors/webhook">/api/sensors/webhook</MenuItem>
                    <MenuItem value="/api/sensors/chirpstack-data">/api/sensors/chirpstack-data</MenuItem>
                    <MenuItem value="/api/SenceCapS2105">/api/SenceCapS2105</MenuItem>
                    <MenuItem value="custom">personalizado</MenuItem>
                </Select>

                {
                    selectValue === "custom" ? (
                        <TextField
                            fullWidth
                            label="personalizado"
                            size="small"
                            name="personalizado"
                            value={textValue}
                            placeholder="busqueda personalizada"
                            onChange={(e) => setTextValue(e.target.value)}
                        />
                    ) : null
                }
            </Stack>

            <TextField
                fullWidth
                sx={{mt: 1}}
                label="json"
                size="small"
                name="json"
                placeholder="busqueda en json"
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
            />
        </>
    )

}