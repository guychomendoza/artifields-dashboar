import {useState, useEffect} from "react";

import TextField from "@mui/material/TextField"

import {useDebounce} from "../../hooks/use-debounce";

type SearchTableProps = {
    onSearch:  (query: string) => void
}

export const SearchTable = ({
    onSearch,
}: SearchTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    return (
        <TextField
            fullWidth
            placeholder="Buscar sensor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    )
}