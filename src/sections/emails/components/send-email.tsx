import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { fetchAllUsers } from '../../../api-requests/users';
import { BACKEND_URL } from '../../../api-requests/api-url';

import type { User } from '../../../api-requests/type';


const generateEmailTemplate = (message: string, subject: string) => {
    const logoUrl = 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefF6Wmfc0v0s5x8Q4aVFIGMnWpY6SvKzygLCrhD';
    const primaryColor = '#53752C';

    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #444444;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      }
      .header {
        padding: 30px 20px;
        background-color: #ffffff;
        text-align: left;
        border-bottom: 1px solid #eeeeee;
      }
      .logo {
        max-width: 180px;
        height: auto;
        margin-bottom: 10px;
      }
      .subject {
        color: ${primaryColor};
        margin: 20px 0 5px;
        font-size: 24px;
        font-weight: 600;
        line-height: 1.3;
      }
      .content {
        padding: 35px 40px;
        background-color: #ffffff;
        color: #555555;
        font-size: 16px;
      }
      .message {
        white-space: pre-line;
      }
      .footer {
        padding: 25px 20px;
        text-align: center;
        background-color: #f9f9f9;
        border-top: 1px solid #eeeeee;
      }
      .company-name {
        color: ${primaryColor};
        font-weight: 700;
        font-size: 16px;
        margin: 0;
        letter-spacing: 1px;
      }
      .copyright {
        margin: 8px 0;
        font-size: 13px;
        color: #888888;
      }
      @media only screen and (max-width: 620px) {
        .container {
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .content {
          padding: 30px 25px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="Artifields Logo" class="logo">
        <h2 class="subject">${subject}</h2>
      </div>
      <div class="content">
        <div class="message">${message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        <p class="company-name">ARTIFIELDS</p>
        <p class="copyright">© ${new Date().getFullYear()} Todos los derechos reservados</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const sendSingleEmail = async (to: string, subject: string, message: string) => {
    try {
        const html = generateEmailTemplate(message, subject);

        const emailData = {
            to,
            subject,
            text: message,
            html
        };

        const response = await fetch(`${BACKEND_URL}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al enviar correo a ${to}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error al enviar correo a ${to}:`, error);
        throw error;
    }
};

const sendEmails = async (recipients: User[], subject: string, message: string) => {

    const sendPromises = recipients.map(user =>
        sendSingleEmail(user.correo, subject, message)
    );

    const results = await Promise.allSettled(sendPromises);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    if (failed > 0) {
        throw new Error(`Se enviaron ${successful} correos correctamente, pero fallaron ${failed} envíos.`);
    }

    return {
        success: true,
        message: `${successful} correos enviados correctamente.`
    };
};

export const SendEmail = () => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const { data } = useQuery({
        queryKey: ['all-users'],
        queryFn: fetchAllUsers,
    });

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const showNotification = (messageNotification: string, severity: 'success' | 'error') => {
        setNotification({
            open: true,
            message: messageNotification,
            severity
        });
    };

    const handleSendEmail = async () => {
        if (!selectedUsers.length || !subject || !message) {
            showNotification('Por favor complete todos los campos', 'error');
            return;
        }

        try {
            setSending(true);
            const result = await sendEmails(selectedUsers, subject, message);

            setSelectedUsers([]);
            setSubject('');
            setMessage('');

            showNotification(result.message, 'success');
        } catch (error: any) {
            console.error('Error:', error);
            showNotification(error.message || 'Error al enviar los correos', 'error');
        } finally {
            setSending(false);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Card sx={{ p: { xs: 2, md: 4 } }}>
                <Stack spacing={3}>
                    <FormControl fullWidth>
                        <Autocomplete
                            multiple
                            options={data || []}
                            getOptionLabel={(option) => option.nombre}
                            value={selectedUsers}
                            onChange={(event, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Seleccionar destinatarios" />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <Box>
                                        <Typography variant="body1">{option.nombre}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.correo}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        label={
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                    {option.nombre}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {option.correo}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ m: 0.5, height: 'auto', py: 1 }}
                                    />
                                ))
                            }
                            componentsProps={{
                                paper: {
                                    sx: {
                                        boxShadow: 3,
                                        borderRadius: 1,
                                        mt: 0.5,
                                        border: "1px solid rgb(240,240,240)",
                                    },
                                },
                            }}
                            disabled={sending}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <OutlinedInput
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ingrese el asunto"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Icon icon="solar:bookmark-square-minimalistic-bold-duotone" width={20} color="#666" />
                                </InputAdornment>
                            }
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)' }}
                            disabled={sending}
                        />
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escriba su mensaje aquí..."
                        sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.03)',
                        }}
                        disabled={sending}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Icon icon="solar:trash-bin-trash-bold" />}
                            onClick={() => {
                                setSelectedUsers([]);
                                setSubject('');
                                setMessage('');
                            }}
                            disabled={sending}
                        >
                            Descartar
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Icon icon="solar:send-bold" />}
                            onClick={handleSendEmail}
                            disabled={sending || !subject || !message || selectedUsers.length === 0}
                        >
                            {sending ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </Box>
                </Stack>
            </Card>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};