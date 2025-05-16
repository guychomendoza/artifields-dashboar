import { useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../../context/AuthContext";
import { updateUserDetails, changeUserPassword } from "../../api-requests/users";

export const EditProfile = () => {
    const { userData } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formData, setFormData] = useState({
        nombre: userData?.nombre || "",
        correo: userData?.correo || "",
        telefono: userData?.telefono || "",
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData({ ...passwordData, [field]: value });
    };

    const handleSave = async () => {
        if (!userData) return;
        if (!formData.nombre || !formData.correo) {
            setError("Tu nombre o correo no pueden estar vacíos");
            return;
        }
        setLoading(true);
        setSuccess(false);
        setError("");

        try {
            const isUpdated = await updateUserDetails(userData.id, {
                nombre: formData.nombre,
                correo: formData.correo,
                tipo_usuario: userData.tipo_usuario,
                telefono: formData.telefono,
                chatbot_whats: userData.chatbot_whats,
            });

            if (!isUpdated) {
                setError("Hubo un error al actualizar tus datos");
                return;
            }

            setSuccess(true);
            setEditing(false);
        } catch (err) {
            setError("Hubo un error al actualizar el perfil. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        if (!userData) return;
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }

        setPasswordLoading(true);
        setPasswordSuccess(false);
        setPasswordError("");

        try {
            const isChanged = await changeUserPassword(userData.id, passwordData.newPassword);

            if (!isChanged) {
                setPasswordError("Hubo un error al cambiar la contraseña");
                return;
            }

            setPasswordSuccess(true);
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPasswordError("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <Card sx={{ marginTop: "1rem" }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Tu información
                </Typography>

                <Stack spacing={3}>
                    {success && <Alert severity="success">Perfil actualizado correctamente.</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Nombre"
                        value={formData.nombre}
                        disabled={!editing || loading}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Correo Electrónico"
                        value={formData.correo}
                        disabled={!editing || loading}
                        onChange={(e) => handleChange("correo", e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Teléfono"
                        value={formData.telefono}
                        disabled={!editing || loading}
                        onChange={(e) => handleChange("telefono", e.target.value)}
                        fullWidth
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        {editing ? (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditing(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Guardar"}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setEditing(true)}
                            >
                                Editar
                            </Button>
                        )}
                    </Stack>

                    {editing && (
                        <>
                            <Divider />
                            <Typography variant="h6">Cambiar Contraseña</Typography>

                            {passwordSuccess && (
                                <Alert severity="success">Contraseña actualizada correctamente.</Alert>
                            )}
                            {passwordError && <Alert severity="error">{passwordError}</Alert>}

                            <TextField
                                label="Nueva Contraseña"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Confirmar Contraseña"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    handlePasswordChange("confirmPassword", e.target.value)
                                }
                                fullWidth
                            />

                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setPasswordData({ newPassword: "", confirmPassword: "" });
                                        setPasswordError("");
                                        setPasswordSuccess(false);
                                        setEditing(false);
                                    }}
                                    disabled={passwordLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handlePasswordSave}
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? <CircularProgress size={24} /> : "Cambiar Contraseña"}
                                </Button>
                            </Stack>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};
