import {useState, useEffect} from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {useDebounce} from "../../../hooks/use-debounce";

type WebhookFilterProps = {
    setModelFilter: (newModel: string) => void;
    setNetworkServerFilter: (newNetworkServer: string) => void;
    setUrlFilter: (newUrl: string) => void;
}

export const WebhookFilters = ({
    setModelFilter,
    setNetworkServerFilter,
    setUrlFilter,
}: WebhookFilterProps) => {
    const [model, setModel] = useState('');
    const [serverNetwork, setServerNetwork] = useState('');
    const [url, setUrl] = useState('');

    const debouncedModel = useDebounce(model, 500);
    const debouncedServerNetwork = useDebounce(serverNetwork, 500);
    const debouncedUrl = useDebounce(url, 500);

    useEffect(() => {
        setModelFilter(debouncedModel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedModel]);

    useEffect(() => {
        setNetworkServerFilter(debouncedServerNetwork);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedServerNetwork]);

    useEffect(() => {
        setUrlFilter(debouncedUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedUrl]);

    return (
        <Stack direction="column" spacing={1}>
            <TextField
                size="small"
                placeholder="modelo"
                label="modelo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
            />

            <TextField
                size="small"
                placeholder="servidor de red"
                label="servidor de red"
                value={serverNetwork}
                onChange={(e) => setServerNetwork(e.target.value)}
            />

            <TextField
                size="small"
                placeholder="url"
                label="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
        </Stack>
    );
};
