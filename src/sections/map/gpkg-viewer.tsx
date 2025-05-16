import 'leaflet/dist/leaflet.css';
import 'react-leaflet-fullscreen/styles.css';

import L from 'leaflet';
import { useDropzone } from 'react-dropzone';
import { useRef, useState, useCallback } from 'react';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import { TileLayer, MapContainer, LayersControl } from 'react-leaflet';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/components/iconify';

import { MapEvents } from './map-events';
import { DrawingLayer } from './drawing-layer';
import { DownloadContent } from './download-content';
import { DownloadDrawnContent } from './download-drawn-content';

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

export const GPKGViewer = () => {
    const mapRef = useRef<L.Map | null>(null);
    const [lineColor, setLineColor] = useState<string>('#0000ff');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [drawnLines, setDrawnLines] = useState<L.Polyline[]>([]);
    const [drawingMode, setDrawingMode] = useState<'draw' | 'erase' | null>(null);
    const smoothingIterations = 2;
    const [, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                const geojsonData = JSON.parse(reader.result as string);
                const geoJsonLayer = L.geoJSON(geojsonData).addTo(mapRef.current!);
                mapRef.current?.fitBounds(geoJsonLayer.getBounds());
            };
            reader.readAsText(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/geo+json': ['.geojson'] },
        maxFiles: 1,
    });

    const handleUndo = useCallback(() => {
        if (drawnLines.length > 0) {
            const lastLine = drawnLines[drawnLines.length - 1];
            mapRef.current?.removeLayer(lastLine);
            setDrawnLines((prevLines) => prevLines.slice(0, -1));
        }
    }, [drawnLines]);

    const handleModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newMode: 'draw' | 'erase' | null
    ) => {
        setDrawingMode(newMode);
    };

    const handleSearch = async (query: string) => {
        if (query.length < 3) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching locations:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = (location: SearchResult | null) => {
        if (location && mapRef.current) {
            const { lat, lon } = location;
            mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 13);
        }
    };

    return (
        <>
            <MapContainer
                center={[24, -99.13322]}
                zoom={5}
                style={{ width: '100%', height: '30rem' }}
                ref={mapRef}
            >
                <LayersControl position="topright">
                    {/* Base Layers */}
                    <LayersControl.BaseLayer checked name="OpenStreetMap Standard">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            attribution='&copy; <a href="https://www.esri.com/">Esri</a> & contributors'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Dark Mode">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Topo">
                        <TileLayer
                            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <DrawingLayer
                    drawingMode={drawingMode}
                    lineColor={lineColor}
                    drawnLines={drawnLines}
                    setDrawnLines={setDrawnLines}
                    smoothingIterations={smoothingIterations}
                />
                <FullscreenControl position="topright" />
                <MapEvents isFullscreen={isFullscreen} setFullscreen={setIsFullscreen} />
                <DownloadContent />
                <DownloadDrawnContent />
            </MapContainer>

            <Card
                sx={{
                    mt: isFullscreen ? 0 : 2,
                    zIndex: 100000,
                    position: isFullscreen ? 'fixed' : 'static',
                    bottom: isFullscreen ? 10 : 'none',
                    right: isFullscreen ? '50%' : 'none',
                    transform: isFullscreen ? 'translateX(50%)' : 'none',
                    width: isFullscreen
                        ? {
                              xs: '95%',
                              md: '60%',
                              lg: '50%',
                          }
                        : '100%',
                }}
            >
                <Stack
                    direction="row"
                    gap={1}
                    p={1}
                    paddingInline={1.3}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Autocomplete
                        freeSolo
                        options={searchResults}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.display_name
                        }
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search locations..."
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isSearching && (
                                                <CircularProgress color="inherit" size={20} />
                                            )}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        onInputChange={(_, newValue) => {
                            setSearchQuery(newValue);
                            handleSearch(newValue);
                        }}
                        onChange={(_, newValue) => {
                            if (newValue && typeof newValue !== 'string') {
                                handleLocationSelect(newValue);
                            }
                        }}
                    />
                    <Box
                        {...getRootProps()}
                        sx={{
                            height: 40,
                            border: 1,
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            borderStyle: 'dashed',
                            padding: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <input {...getInputProps()} />
                        <Iconify
                            icon="bi:file-earmark-arrow-up"
                            sx={{ color: 'primary.main' }}
                            width={24}
                        />
                        {isDragActive ? (
                            <Typography variant="body2" align="center">
                                Drop your file
                            </Typography>
                        ) : (
                            <Typography variant="body2" align="center">
                                .geojson
                            </Typography>
                        )}
                    </Box>
                    <ToggleButtonGroup
                        value={drawingMode}
                        exclusive
                        onChange={handleModeChange}
                        aria-label="drawing mode"
                        size="small"
                    >
                        <ToggleButton value="draw" aria-label="draw mode">
                            Draw
                        </ToggleButton>
                        <ToggleButton value="erase" aria-label="erase mode">
                            Erase
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                        type="color"
                        sx={{ width: '100px' }}
                        value={lineColor}
                        onChange={(e) => setLineColor(e.target.value)}
                        size="small"
                    />
                    <IconButton
                        size="small"
                        onClick={handleUndo}
                        disabled={drawnLines.length === 0}
                    >
                        <Iconify icon="bi:arrow-counterclockwise" width={20} />
                    </IconButton>
                </Stack>
            </Card>
        </>
    );
};
