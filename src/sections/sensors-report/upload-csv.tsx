import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Spinner from '@mui/material/CircularProgress';

import { PYTHON_API_URL } from 'src/api-requests/api-url';

import { Iconify } from 'src/components/iconify';

import { ActiveSection } from './view/types';

export const UploadCsv = ({
    csvFile,
    setCsvFile,
    setImageUrl,
    plotName,
    setPlotName,
    isSectionActive,
    setActiveSection,
    setBlobImage,
}: {
    csvFile: File | null;
    setCsvFile: (file: File) => void;
    setImageUrl: (url: string) => void;
    plotName: string;
    setPlotName: (name: string) => void;
    isSectionActive: boolean;
    setActiveSection: (section: ActiveSection) => void;
    setBlobImage: (blob: Blob) => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                setCsvFile(acceptedFiles[0]);
            }
        },
        [setCsvFile]
    );

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!plotName) {
            setErrorMessage('El nombre de la gráfica es requerido');
            setInterval(() => {
                setErrorMessage(null);
            }, 3000);
            return;
        }

        if (!csvFile) {
            setErrorMessage('El archivo CSV es requerido');
            setInterval(() => {
                setErrorMessage(null);
            }, 3000);
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('nombre_grafica', plotName);
            formData.append('file', csvFile);

            const response = await fetch(`${PYTHON_API_URL}/csv/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.status !== 200) {
                console.error('Error uploading file');
                return;
            }

            const blob = await response.blob();
            const requestImageUrl = URL.createObjectURL(blob);
            setImageUrl(requestImageUrl);
            setActiveSection(ActiveSection.UPDATE_REPORT);
            setBlobImage(blob);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            sx={{
                border: isSectionActive ? '1px solid' : 'none',
                borderColor: 'primary.main',
                padding: 3,
                mt: 3,
                pointerEvents: !isSectionActive || isLoading ? 'none' : 'auto',
                opacity: isSectionActive ? 1 : 0.4,
            }}
        >
            <TextField
                fullWidth
                name="name"
                label="Nombre de la gráfica"
                InputLabelProps={{ shrink: true }}
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="Temperatura en el invernadero"
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
                        Arrastra tu archivo aquí (.csv), o haz clic para seleccionarlo.
                    </Typography>
                )}
                {acceptedFiles.length > 0 && (
                    <Typography variant="body2">
                        Archivo seleccionado: {acceptedFiles[0].name}
                    </Typography>
                )}
            </Box>

            {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                fullWidth
                sx={{
                    mt: 2,
                }}
                disabled={isLoading}
            >
                {isLoading ? <Spinner size={24} color="inherit" /> : 'Obtener reporte'}
            </Button>
        </Card>
    );
};
