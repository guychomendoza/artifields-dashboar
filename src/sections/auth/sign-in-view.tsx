import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useAuth } from 'src/context/AuthContext';
import { BACKEND_URL } from 'src/api-requests/api-url';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
    const { login } = useAuth();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [images, setImages] = useState<
        {
            id: number;
            nombre: string;
            img: string;
        }[]
    >([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchLoginImages = useCallback(async () => {
        const res = await fetch(`${BACKEND_URL}/api/login`);
        if (res.status !== 200) return;
        const data = await res.json();
        setImages(data);
    }, [setImages]);

    useEffect(() => {
        fetchLoginImages();
    }, [fetchLoginImages]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (images.length === 0) return;
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleSignIn = async () => {
        if (!email || !password) {
            showAndHideMessage('Ingrese un correo electrónico y una contraseña');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            showAndHideMessage('Ingrese un correo electrónico válido');
            return;
        }

        setIsPending(true);
        const { message, isSuccessful } = await login(email, password);

        if (!isSuccessful) {
            showAndHideMessage(message);
            setIsPending(false);
        }

        setIsPending(false);
    };

    const showAndHideMessage = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    };

    const renderForm = (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
            <TextField
                fullWidth
                name="email"
                label="Correo"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                fullWidth
                name="password"
                label="Contraseña"
                InputLabelProps={{ shrink: true }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify
                                    icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
                    {errorMessage}
                </Typography>
            )}

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="contained"
                onClick={handleSignIn}
                loading={isPending}
            >
                Sign in
            </LoadingButton>
        </Box>
    );

    return (
        <Grid container sx={{ bgColor: 'blue', width: '100%', height: '100vh' }}>
            <Grid item xs={0} md={6} sx={{ position: 'relative', overflow: 'hidden' }}>
                {images.map((image, index) => (
                    <img
                        key={image.id}
                        src={image.img}
                        alt={image.nombre}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: index === currentImageIndex ? 1 : 0,
                            transition: 'opacity 1s ease-in-out',
                        }}
                    />
                ))}
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        py: 5,
                        px: 3,
                        width: 1,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.default',
                        maxWidth: 'var(--layout-auth-content-width)',
                    }}
                >
                    <Box
                        gap={1.5}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ mb: 5 }}
                    >
                        <Typography variant="h5">Sign in</Typography>
                    </Box>

                    {renderForm}
                </Box>
            </Grid>
        </Grid>
    );
}
