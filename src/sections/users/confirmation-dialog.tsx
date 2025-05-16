import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export const ConfirmationDialog = ({
    open,
   onClose,
   onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Estás seguro que deseas activar el chatbot de WhatsApp para este usuario?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="inherit">
                Cancelar
            </Button>
            <Button onClick={onConfirm} variant="contained" color="primary">
                Confirmar
            </Button>
        </DialogActions>
    </Dialog>
)