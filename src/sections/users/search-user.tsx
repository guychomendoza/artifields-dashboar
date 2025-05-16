
import {useState, useEffect} from "react";

import TextField from "@mui/material/TextField"

import {useDebounce} from "../../hooks/use-debounce";

type SearchUserProps = {
    onSearch:  (query: string) => void
}

export const SearchUser = ({
    onSearch,
}: SearchUserProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    return (
        <TextField
            fullWidth
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    )
}