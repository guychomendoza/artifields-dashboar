import { Icon } from '@iconify/react';
import { useParams, useNavigate } from "react-router-dom";
import {useState, useEffect, type FormEvent, type ChangeEvent} from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { green } from '@mui/material/colors';
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { BACKEND_URL } from "../../../api-requests/api-url";

export const ResetPasswordView = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPasswordSet, setIsPasswordSet] = useState(false);

    // Password state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            setIsLoading(true);
            try {
                if (!token) {
                    setIsTokenValid(false);
                    return;
                }

                const res = await fetch(`${BACKEND_URL}/api/users/verify-reset-token/${token}`);
                const data = await res.json();

                if (res.status === 400 && data.message === "Token inválido o expirado") {
                    setIsTokenValid(false);
                } else {
                    setIsTokenValid(true);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsTokenValid(false);
            } finally {
                setIsLoading(false);
            }
        }

        verifyToken();
    }, [token]);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value);

        // Basic password validation
        if (e.target.value.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nuevaContraseña: password,
                })
            });

            const data = await res.json();

            if (res.ok && data.message === "Contraseña actualizada correctamente") {
                // Password set successfully
                setIsPasswordSet(true);
            } else {
                // Handle error
                setPasswordError(data.message || 'Error al configurar la contraseña');
            }
        } catch (error) {
            console.error('Error setting password:', error);
            setPasswordError('Error de red. Inténtalo de nuevo.');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleNavigateToLogin = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!token) {
        return (
            <Box>
                <Typography variant="h1" color="textSecondary">
                    Lo sentimos, link no válido
                </Typography>
            </Box>
        )
    }

    if (!isTokenValid) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        textAlign: "center",
                        maxWidth: "65ch"
                    }}
                >
                    Lo sentimos, link no válido, contacta con el administrador para generar uno nuevo
                </Typography>
            </Box>
        )
    }

    // Success state after password is set
    if (isPasswordSet) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    backgroundColor: "background.default"
                }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        width: '100%',
                        p: 2,
                        textAlign: 'center'
                    }}
                >
                    <Icon
                        icon="mdi:check-circle"
                        width={64}
                        color={green[500]}
                        style={{ margin: '0 auto', display: 'block' }}
                    />
                    <Typography
                        variant="h6"
                        color="success.main"
                        sx={{
                            mt: 2,
                            mb: 2,
                            color: green[600]
                        }}
                    >
                        Contraseña configurada correctamente
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNavigateToLogin}
                        sx={{ mt: 2 }}
                    >
                        Iniciar Sesión
                    </Button>
                </Card>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "background.default"
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 2
                }}
            >
                <CardHeader
                    title="Crea tu contraseña"
                    subheader="Termina de configurar tu cuenta"
                    titleTypographyProps={{
                        variant: "h5",
                        align: "center"
                    }}
                    subheaderTypographyProps={{
                        variant: "subtitle2",
                        align: "center"
                    }}
                />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Contraseña"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <Icon icon="mdi:eye-off-outline" width={24} />
                                            ) : (
                                                <Icon icon="mdi:eye-outline" width={24} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Confirmar Contraseña"
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={!!passwordError && password !== confirmPassword}
                            helperText={password !== confirmPassword ? 'Las contraseñas no coinciden' : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <Icon icon="mdi:eye-off-outline" width={24} />
                                            ) : (
                                                <Icon icon="mdi:eye-outline" width={24} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, py: 1.5 }}
                        >
                            Establecer Contraseña
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}