import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Spinner from '@mui/material/CircularProgress';

import { useAuth } from 'src/context/AuthContext';
import { type ImageAnalysis } from 'src/api-requests/type';
import { BACKEND_URL, PYTHON_API_URL } from 'src/api-requests/api-url';

import { ActiveSection } from './view/types';

export const UpdateCsv = ({
    csvFile,
    imageUrl,
    setImageUrl,
    plotName,
    setPlotName,
    isSectionActive,
    setActiveSection,
    fieldCapacity,
    setFieldCapacity,
    blobImage,
    setBlobImage,
    restartState,
    refetchReports,
}: {
    csvFile: File | null;
    imageUrl: string;
    setImageUrl: (url: string) => void;
    plotName: string;
    setPlotName: (name: string) => void;
    isSectionActive: boolean;
    setActiveSection: (section: ActiveSection) => void;
    fieldCapacity: string;
    setFieldCapacity: (fieldCapacity: string) => void;
    blobImage: Blob | null;
    setBlobImage: (blob: Blob) => void;
    restartState: () => void;
    refetchReports: () => Promise<void>;
}) => {
    const { userData } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [reportContent, setReportContent] = useState<string | null>(null); // To hold the editable content

    const handleUpdate = async () => {
        if (!csvFile || !plotName || !fieldCapacity) {
            console.error('No file or plot name');
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('nombre_grafica', plotName);
            formData.append('capacidad_campo', fieldCapacity);
            formData.append('file', csvFile);

            const response = await fetch(`${PYTHON_API_URL}/csv/upload_with_cc`, {
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
            setBlobImage(blob);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageAnalysis = async () => {
        if (!blobImage) {
            console.error('No blob image');
            return;
        }

        try {
            setIsLoading(true);
            const imageAnalysisFormData = new FormData();
            imageAnalysisFormData.append('image', blobImage, 'image.png');

            const imageAnalysisResponse = await fetch(`${PYTHON_API_URL}/api/analyze-image`, {
                method: 'POST',
                body: imageAnalysisFormData,
            });

            if (imageAnalysisResponse.status !== 200) {
                console.error('Error analyzing image');
                return;
            }

            const imageAnalysisJson: ImageAnalysis = await imageAnalysisResponse.json();
            setReportContent(imageAnalysisJson?.choices[0]?.message?.content || ''); // Set the content
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveReport = async () => {
        if (!plotName || blobImage === null || !reportContent) return;
        if (!userData?.id) return;

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('user_id', `${userData.id}`);
            formData.append('file_name', plotName);
            formData.append('image', blobImage, 'image.png');
            formData.append('suggestions', reportContent);

            const response = await fetch(`${BACKEND_URL}/api/reporte/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.status !== 201) {
                console.error('Error uploading report');
                return;
            }

            // await response.json();
            await refetchReports();
            restartState();
            setActiveSection(ActiveSection.UPLOAD_CSV);
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
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Gráfica"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            )}

            <Typography
                variant="body2"
                align="center"
                sx={{
                    mt: 2,
                }}
            >
                Deseas continuar o actualizar/modificar manualmente algun dato?
            </Typography>

            <TextField
                fullWidth
                name="name"
                label="Nombre de la gráfica"
                InputLabelProps={{ shrink: true }}
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="Temperatura en el invernadero"
                sx={{
                    mt: 3,
                }}
            />

            <TextField
                fullWidth
                name="field_capacity"
                label="Capacidad de campo"
                InputLabelProps={{ shrink: true }}
                value={fieldCapacity}
                onChange={(e) => setFieldCapacity(e.target.value)}
                sx={{
                    mt: 3,
                }}
            />

            {reportContent !== null && (
                <TextField
                    fullWidth
                    multiline
                    rows={20}
                    label="Reporte"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    sx={{ mt: 3 }}
                />
            )}

            <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleUpdate}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner size={24} color="inherit" /> : 'Actualizar'}
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleImageAnalysis}
                    disabled={isLoading || reportContent !== null} // Disabled once content is fetched
                >
                    {isLoading ? (
                        <Spinner size={24} color="inherit" />
                    ) : (
                        'Obtener Contenido del Reporte'
                    )}
                </Button>
            </Stack>

            <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={saveReport}
                disabled={!reportContent} // Disabled if there's no content to save
            >
                {isLoading ? <Spinner size={24} color="inherit" /> : 'Guardar Reporte'}
            </Button>
        </Card>
    );
};
