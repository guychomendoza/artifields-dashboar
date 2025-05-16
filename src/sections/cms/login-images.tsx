import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { BACKEND_URL } from 'src/api-requests/api-url';

import { UploadedImages } from './uploaded-images';
import { UploadLoginImage } from './upload-login-image';

export const LoginImages = () => {
    const [loginImages, setLoginImages] = useState<
        {
            id: number;
            nombre: string;
            img: string;
        }[]
    >([]);

    const fetchLoginImages = useCallback(async () => {
        const res = await fetch(`${BACKEND_URL}/api/login`);
        if (res.status !== 200) return;
        const data = await res.json();
        setLoginImages(data);
    }, []);

    useEffect(() => {
        fetchLoginImages();
    }, [fetchLoginImages]);

    return (
        <Card>
            <CardHeader title="Login Images" />
            <CardContent>
                <UploadLoginImage refetchImages={fetchLoginImages} />
                <UploadedImages images={loginImages} refetchImages={fetchLoginImages} />
            </CardContent>
        </Card>
    );
};
