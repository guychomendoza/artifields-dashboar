import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { Column } from './column';
import { Iconify } from '../../../../components/iconify';

import type { ClustersAndSensorsByRanchId } from '../../../../api-requests/ranches/schema';

type SensorsColumnProps = {
    onBack?: () => void;
    showBackButton?: boolean;
    selectedCluster: ClustersAndSensorsByRanchId | null;
};

export const SensorsColumn = ({ onBack, showBackButton, selectedCluster }: SensorsColumnProps) => {
    const hasSensors = selectedCluster?.sensor15 || selectedCluster?.sensor30;

    return (
        <Column>
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    height: 65,
                }}
            >
                {showBackButton && (
                    <IconButton onClick={onBack} edge="start" sx={{ mr: 1 }}>
                        <Iconify icon="solar:arrow-left-line-duotone" />
                    </IconButton>
                )}

                <Typography variant="h6" component="div">
                    Sensores
                </Typography>
            </Box>

            {selectedCluster ? (
                hasSensors ? (
                    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {selectedCluster.sensor15?.info && (
                            <ListItem>
                                <Link
                                    to={`/iot/sensor/${selectedCluster.sensor15.info.deviceId}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemText
                                        primary={selectedCluster.sensor15.info.name || 'Sin nombre'}
                                        secondary={selectedCluster.sensor15.info.deviceId}
                                    />
                                </Link>
                            </ListItem>
                        )}
                        {selectedCluster.sensor30?.info && (
                            <ListItem>
                                <Link
                                    to={`/iot/sensor/${selectedCluster.sensor30.info.deviceId}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemText
                                        primary={selectedCluster.sensor30.info.name || 'Sin nombre'}
                                        secondary={selectedCluster.sensor30.info.deviceId}
                                    />
                                </Link>
                            </ListItem>
                        )}
                    </List>
                ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            Sin sensores por mostrar
                        </Typography>
                    </Box>
                )
            ) : null}
        </Column>
    );
};
