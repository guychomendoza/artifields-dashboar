import 'react-image-crop/dist/ReactCrop.css';

import { useDropzone } from 'react-dropzone';
import React, { useState, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { BACKEND_URL } from 'src/api-requests/api-url';

export const UploadLoginImage = ({ refetchImages }: { refetchImages: () => void }) => {
    const [errorMessages, setErrorMessages] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [propName, setPropName] = useState<string>('');
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 18,
        height: 32,
        x: 0,
        y: 0,
    });
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            setErrorMessages('');
            setCroppedImage(null);

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setShowCropDialog(true);
            });
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const getCroppedImg = (image: HTMLImageElement, cropImg: Crop): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = cropImg.width!;
        canvas.height = cropImg.height!;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        ctx.drawImage(
            image,
            cropImg.x! * scaleX,
            cropImg.y! * scaleY,
            cropImg.width! * scaleX,
            cropImg.height! * scaleY,
            0,
            0,
            cropImg.width!,
            cropImg.height!
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty');
                }
                resolve(blob);
            }, 'image/jpeg', 1);
        });
    };

    const handleConfirmCrop = async () => {
        if (!imgRef.current || !crop.width || !crop.height) {
            setErrorMessages('Please complete the crop before confirming');
            return;
        }

        try {
            const croppedImg = await getCroppedImg(imgRef.current, crop);
            setCroppedImage(croppedImg);
            setShowCropDialog(false);
        } catch (error) {
            setErrorMessages('Error cropping image');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !croppedImage) {
            setErrorMessages('Please select and crop an image first');
            return;
        }

        if (!propName.trim()) {
            setErrorMessages('Please enter a prop name');
            return;
        }

        setIsUploading(true);
        setErrorMessages('');

        try {
            const formData = new FormData();
            formData.append('img', croppedImage, selectedFile.name);
            formData.append('nombre', propName);

            const res = await fetch(`${BACKEND_URL}/api/login`, {
                method: 'POST',
                body: formData,
            });

            if (res.status !== 201) {
                throw new Error('Failed to upload image');
            }

            refetchImages();
            setSelectedFile(null);
            setPropName('');
            setImgSrc('');
            setCroppedImage(null);
        } catch (error: any) {
            setErrorMessages(error.message || 'Failed to upload image');
            setTimeout(() => {
                setErrorMessages('');
            }, 3000);
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
        disabled: isUploading,
    });

    return (
        <>
            <Stack spacing={2}>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #ccc',
                        padding: 2,
                        textAlign: 'center',
                        borderRadius: 1,
                        backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        opacity: isUploading ? 0.5 : 1,
                        position: 'relative',
                    }}
                >
                    {isUploading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    <input {...getInputProps()} disabled={isUploading} />
                    <Typography>
                        {selectedFile
                            ? `Selected file: ${selectedFile.name}`
                            : isDragActive
                                ? 'Drop the file here...'
                                : 'Drag and drop a file here, or click to select one'}
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Nombre"
                    variant="outlined"
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    disabled={isUploading || !selectedFile}
                    placeholder="Nombre"
                />

                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile || !propName.trim() || !croppedImage}
                    fullWidth
                >
                    {isUploading ? 'Uploading...' : 'Save Image'}
                </Button>

                {errorMessages && (
                    <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
                        {errorMessages}
                    </Typography>
                )}
            </Stack>

            <Dialog
                open={showCropDialog}
                onClose={() => setShowCropDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            aspect={3/4}
                            className="max-h-[70vh]"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                            />
                        </ReactCrop>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCropDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmCrop}
                        variant="contained"
                        disabled={!crop.width || !crop.height}
                    >
                        Confirm Crop
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};