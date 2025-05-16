import type { ImageResult, ProjectAnalysis } from 'src/api-requests/type';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Map, APIProvider, AdvancedMarker } from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';

import { fetchProjectAnalysis } from 'src/api-requests/projects';

import { ResultsModal } from './view/results-modal';

export const ResultsMap = () => {
    const { id } = useParams();
    const [openModalDetails, setOpenModalDetails] = useState(false);
    const [selectedData, setSelectedData] = useState<ImageResult | null>(null);
    const [projectAnalysisResult, setProjectAnalysisResult] = useState<ProjectAnalysis | null>(
        null
    );
    const [initialPosition, setInitialPosition] = useState({
        lat: 21.228386694444442,
        lng: -102.39980066666668,
    });

    const handleOpen = () => setOpenModalDetails(true);
    const handleClose = () => setOpenModalDetails(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchProjectAnalysis(Number(id));
            if (!result) return;
            setProjectAnalysisResult(result);
            if (result?.images?.length > 0) {
                setInitialPosition({
                    lat: Number(result.images[0].latitude),
                    lng: Number(result.images[0].longitude),
                });
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}>
                <Box height="70vh">
                    <Map
                        defaultZoom={17}
                        defaultCenter={initialPosition}
                        streetViewControl={false}
                        mapTypeId="satellite"
                        gestureHandling="greedy"
                        disableDefaultUI
                        mapId="f1b7b1b3b1b3b1b3"
                    >
                        {projectAnalysisResult?.images.map((item, index) => (
                            <AdvancedMarker
                                key={index}
                                position={{
                                    lat: Number(item.latitude),
                                    lng: Number(item.longitude),
                                }}
                                onClick={() => {
                                    setSelectedData(item);
                                    handleOpen();
                                }}
                            >
                                <Box height={25} width={25} bgcolor="red" borderRadius={20} />
                            </AdvancedMarker>
                        ))}
                    </Map>
                </Box>
            </APIProvider>

            {selectedData && (
                <ResultsModal
                    data={selectedData}
                    isOpen={openModalDetails}
                    handleClose={handleClose}
                    projectName={projectAnalysisResult?.name ?? 'Proyecto sin nombre'}
                />
            )}
        </>
    );
};
