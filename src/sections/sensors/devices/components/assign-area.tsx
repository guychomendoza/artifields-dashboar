import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

import { RanchMap } from './ranch-map';
import {ReactMap} from "../../../../layouts/components/react-map";

type AssignCoordinatesRanchProps = {
    isOpen: boolean;
    handleClose: () => void;
    deviceId: string;
}

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

export const AssignArea = ({
   deviceId,
    isOpen,
    handleClose,
}: AssignCoordinatesRanchProps) => (
        <Modal
                open={isOpen}
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
                            md: 600,
                            lg: 800,
                        },
                    }}
                >
                    <CardHeader
                        title="Área del sensor"
                        subheader="Asigna un área al sensor"
                        action={
                            <IconButton
                                onClick={handleClose}
                                aria-label="cerrar"
                            >
                                <Iconify icon="solar:close-circle-linear" width={32} height={32} />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <ReactMap>
                            <RanchMap deviceId={deviceId}/>
                        </ReactMap>
                    </CardContent>
                </Card>
            </Modal>
    );