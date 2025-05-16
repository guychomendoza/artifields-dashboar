import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { BACKEND_URL } from '../../../../api-requests/api-url';

export const DeleteRanch = ({ ranchId, refetch, onCloseDrawer}: { ranchId: number, refetch: () => void, onCloseDrawer: () => void; }) => {
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BACKEND_URL}/api/rancho/delete/${ranchId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Error al eliminar el rancho");
            }
            return response.json();
        },
        onSuccess: (data) => {
            if (data.message === "Rancho eliminado exitosamente.") {
                refetch();
                setOpen(false);
                onCloseDrawer();
            }
        },
    });

    return (
        <>
            <Button variant="contained" color="error" onClick={() => setOpen(true)} sx={{ mb: 4, width: "100%" }}>
                Eliminar Rancho
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>¿Estás seguro de eliminar este rancho?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => mutation.mutate()} color="error" disabled={mutation.isPending}>
                        {mutation.isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
