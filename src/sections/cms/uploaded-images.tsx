import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { BACKEND_URL } from 'src/api-requests/api-url';

import { Iconify } from 'src/components/iconify';

export const UploadedImages = ({
    images,
    refetchImages,
}: {
    images: {
        id: number;
        nombre: string;
        img: string;
    }[];
    refetchImages: () => void;
}) => {
    const onDelete = async (id: number) => {
        const res = await fetch(`${BACKEND_URL}/api/login/${id}`, {
            method: 'DELETE',
        });
        if (res.status === 200) {
            refetchImages();
        }
    };

    return (
        <Grid container spacing={3} mt={1}>
            {images.map((image) => (
                <Grid
                    item
                    key={image.id}
                    xs={6}
                    sm={3}
                    md={2}
                    sx={{
                        position: 'relative',
                    }}
                >
                    <img
                        src={image.img}
                        alt={image.nombre}
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: 10,
                        }}
                    />
                    {images.length > 1 && (
                        <IconButton
                            onClick={() => onDelete(image.id)}
                            sx={{
                                position: 'absolute',
                                right: 2,
                                bottom: 2,
                                backdropFilter: 'blur(4px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                        >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                    )}
                </Grid>
            ))}
        </Grid>
    );
};
