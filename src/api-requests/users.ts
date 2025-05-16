import { BACKEND_URL } from './api-url';

import type { User, TokenUser } from './type';

export const fetchAllUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/users/users`);
        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
};

export const fetchUsersWithExpiredTokens = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/users/expired-tokens`);
        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data as TokenUser[];
    } catch (error) {
        return [];
    }
}

export const deleteUserById = async (id: number): Promise<boolean> => {
    if (!id) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/users/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            return false;
        }

        if (response.status !== 200) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

export const changeUserPassword = async (id: number, password: string): Promise<boolean> => {
    if (!password || !id) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/users/users/${id}/reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nuevaContraseña : password,
            }),
        });

        if (!response.ok) {
            return false;
        }

        if (response.status !== 200) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};


export const updateUserDetails = async (
    id: number,
    data: {
        nombre: string;
        correo: string;
        tipo_usuario: number,
        telefono: string,
        chatbot_whats: boolean,
    }
): Promise<boolean> => {

    try {
        const response = await fetch(`${BACKEND_URL}/api/users/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return false;
        }

        return response.status === 200;

    } catch (error) {
        return false;
    }

}