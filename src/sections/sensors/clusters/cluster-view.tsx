import { useState } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {SensorsColumn} from "./components/sensors-column";
import { RanchesColumn } from './components/ranches-column';
import { ClustersColumn } from './components/clusters-column';

import type {RanchWithSensors, ClustersAndSensorsByRanchId} from '../../../api-requests/ranches/schema';

export const ClusterView = () => {
    const [selectedRanch, setSelectedRanch] = useState<RanchWithSensors | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<ClustersAndSensorsByRanchId | null>(null);
    const [activeScreen, setActiveScreen] = useState<'ranchos' | 'clusters' | 'sensors'>('ranchos');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleRanchClick = (ranch: RanchWithSensors) => {
        setSelectedRanch(ranch);
        setSelectedCluster(null);
        if (isMobile) {
            setActiveScreen('clusters');
        }
    };

    const handleClusterClick = (cluster: ClustersAndSensorsByRanchId) => {
        setSelectedCluster(cluster);
        if (isMobile) {
            setActiveScreen('sensors');
        }
    };

    const handleBack = () => {
        if (activeScreen === 'sensors') {
            setActiveScreen('clusters');
            setSelectedCluster(null);
        } else if (activeScreen === 'clusters') {
            setActiveScreen('ranchos');
            setSelectedRanch(null);
        }
    };

    if (isMobile) {
        switch (activeScreen) {
            case 'ranchos':
                return (
                    <RanchesColumn
                        onItemClick={handleRanchClick}
                        selectedRanch={selectedRanch}
                    />
                );
            case 'clusters':
                return (
                    <ClustersColumn
                        selectedCluster={selectedCluster}
                        selectedRanch={selectedRanch}
                        onItemClick={handleClusterClick}
                        showBackButton={isMobile}
                        onBack={handleBack}
                    />
                );
            case 'sensors':
                return (
                    <SensorsColumn
                        selectedCluster={selectedCluster}
                        showBackButton={isMobile}
                        onBack={handleBack}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <RanchesColumn
                onItemClick={handleRanchClick}
                selectedRanch={selectedRanch}
            />
            <ClustersColumn
                selectedCluster={selectedCluster}
                selectedRanch={selectedRanch}
                onItemClick={handleClusterClick}
                showBackButton={isMobile}
                onBack={handleBack}
            />
            <SensorsColumn
                selectedCluster={selectedCluster}
                showBackButton={isMobile}
                onBack={handleBack}
            />
        </Box>
    );
};
