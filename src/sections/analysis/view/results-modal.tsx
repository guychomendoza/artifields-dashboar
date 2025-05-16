import type { ImageResult } from 'src/api-requests/type';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

interface Props {
    data: ImageResult;
    isOpen: boolean;
    handleClose: () => void;
    projectName: string;
}

export const ResultsModal = ({ data, isOpen, handleClose, projectName }: Props) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Card
                sx={{
                    ...style,
                    width: {
                        xs: '90%',
                        sm: 550,
                        md: 800,
                        lg: 1000,
                    },
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" flexGrow={1}>
                        {projectName}
                    </Typography>

                    <IconButton onClick={handleClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Tabs value={value} onChange={handleChange} aria-label="vistas-disponibles">
                        <Tab
                            label="Original"
                            {...a11yProps(0)}
                            sx={{ borderRadius: 1, marginBottom: 0.5 }}
                        />
                        <Tab
                            label="Resultado"
                            {...a11yProps(1)}
                            sx={{ borderRadius: 1, marginBottom: 0.5 }}
                        />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        <img
                            src={data.url_original}
                            alt="original"
                            style={{ width: '100' }}
                            loading="lazy"
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <img
                            src={data.url_detected}
                            alt="resultado"
                            style={{ width: '100%' }}
                            loading="lazy"
                        />
                    </CustomTabPanel>
                </Box>
            </Card>
        </Modal>
    );
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vista-${index}`}
            aria-labelledby={`vista-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
