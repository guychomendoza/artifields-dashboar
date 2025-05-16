import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback, type FormEvent } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import ListItemButton from '@mui/material/ListItemButton';

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const PlacesAutocomplete = ({ onPlaceSelect }: Props) => {
    const map = useMap();
    const places = useMapsLibrary('places');
    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
    const [autocompleteService, setAutocompleteService] =
        useState<google.maps.places.AutocompleteService | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(
        null
    );
    const [predictionResults, setPredictionResults] = useState<
        Array<google.maps.places.AutocompletePrediction>
    >([]);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (!places || !map) return;

        setAutocompleteService(new places.AutocompleteService());
        setPlacesService(new places.PlacesService(map));
        setSessionToken(new places.AutocompleteSessionToken());

        return () => setAutocompleteService(null);
    }, [map, places]);

    const fetchPredictions = useCallback(
        async (value: string) => {
            if (!autocompleteService || !value) {
                setPredictionResults([]);
                return;
            }

            const request = { input: value, sessionToken };
            const response = await autocompleteService.getPlacePredictions(request);
            setPredictionResults(response.predictions);
        },
        [autocompleteService, sessionToken]
    );

    const onInputChange = useCallback(
        (event: FormEvent<HTMLInputElement>) => {
            const value = (event.target as HTMLInputElement)?.value;

            setInputValue(value);
            fetchPredictions(value);
        },
        [fetchPredictions]
    );

    const handleSuggestionClick = useCallback(
        (placeId: string) => {
            if (!places) return;

            const detailRequestOptions = {
                placeId,
                fields: ['geometry', 'name', 'formatted_address'],
                sessionToken,
            };

            const detailsRequestCallback = (
                placeDetails: google.maps.places.PlaceResult | null
            ) => {
                onPlaceSelect(placeDetails);
                setPredictionResults([]);
                setInputValue(placeDetails?.formatted_address ?? '');
                setSessionToken(new places.AutocompleteSessionToken());
            };

            placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
        },
        [onPlaceSelect, places, placesService, sessionToken]
    );

    return (
        <Box
            className="autocomplete-container"
            sx={{
                mt: {
                    xs: 8,
                    sm: 1,
                },
            }}
        >
            <Card
                sx={{
                    borderRadius: 1,
                    width: {
                        xs: '14rem',
                        sm: '20rem',
                        md: '25rem',
                    },
                }}
            >
                <TextField
                    value={inputValue}
                    onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
                    placeholder="Search for a place"
                    fullWidth
                    size="small"
                    type="text"
                />
            </Card>

            {predictionResults.length > 0 && (
                <Card sx={{ position: 'absolute', width: '100%', zIndex: 10, mt: 1 }}>
                    <CardContent>
                        <List>
                            {predictionResults.map(({ place_id, description }) => (
                                <ListItem
                                    key={place_id}
                                    disablePadding
                                    onClick={() => handleSuggestionClick(place_id)}
                                >
                                    <ListItemButton>{description}</ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
