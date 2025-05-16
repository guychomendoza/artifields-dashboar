import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuth } from 'src/context/AuthContext';
import { BACKEND_URL } from 'src/api-requests/api-url';

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

export const NewProjectModal = ({ refetchData }: { refetchData: () => {} }) => {
    const { userData } = useAuth();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [newProjectName, setNewProjectName] = useState('');
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const uploadProject = useCallback(async () => {
        if (!userData) return;
        if (!newProjectName) return;
        if (!zipFile) return;

        try {
            const formData = new FormData();
            formData.append('name', newProjectName);
            formData.append('id', userData?.id.toString());
            formData.append('zipfile', zipFile);

            setIsPending(true);

            const response = await fetch(`${BACKEND_URL}/api/images/upload-zip`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                setErrorMessage('Error al subir el archivo');
                return;
            }

            setErrorMessage(null);
            setIsPending(false);
            setNewProjectName('');
            setZipFile(null);
            handleClose();
            refetchData();
        } catch (error) {
            console.log(error);
        }
    }, [userData, newProjectName, zipFile, refetchData]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setZipFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: { 'application/zip': ['.zip'] },
        maxFiles: 1,
    });

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleOpen}
            >
                Nuevo Proyecto
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Card
                    sx={{
                        ...style,
                        width: {
                            xs: '90%',
                            sm: 400,
                            md: 500,
                            lg: 600,
                        },
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5" flexGrow={1}>
                            Nuevo proyecto
                        </Typography>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Box>

                    <Box sx={{ mt: 3, mb: 2 }}>
                        <TextField
                            fullWidth
                            name="name"
                            label="Nombre"
                            InputLabelProps={{ shrink: true }}
                            placeholder='rancho "El descanso"'
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                        />

                        <Box
                            sx={{
                                mt: 3,
                                height: 120,
                                border: 1,
                                borderColor: 'primary.main',
                                borderRadius: 1,
                                borderStyle: 'dashed',
                                padding: 2,
                            }}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Iconify
                                icon="bi:file-earmark-arrow-up"
                                sx={{ color: 'primary.main' }}
                                width={36}
                            />
                            {isDragActive ? (
                                <Typography variant="body2" align="center">
                                    Suelta tus archivos aquí
                                </Typography>
                            ) : (
                                <Typography variant="body2" align="center">
                                    Arrastra tu archivo aquí (.zip), o haz clic para seleccionarlos.
                                </Typography>
                            )}
                            {acceptedFiles.length > 0 && (
                                <Typography variant="body2">
                                    Archivo seleccionado: {acceptedFiles[0].name}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {isPending && (
                        <Typography variant="body2" color="info" sx={{ mb: 1.5 }}>
                            Subiendo archivo... (esto puede tardar unos minutos)
                        </Typography>
                    )}
                    <LoadingButton
                        variant="contained"
                        fullWidth
                        onClick={uploadProject}
                        loading={isPending}
                    >
                        Crear
                    </LoadingButton>
                </Card>
            </Modal>
        </>
    );
};
