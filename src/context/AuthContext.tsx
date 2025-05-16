import {useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect, useContext, createContext } from 'react';

import { BACKEND_URL } from 'src/api-requests/api-url';

import type {User} from "../api-requests/type";


export type Roles = 'user' | 'user2' | 'admin' | 'superadmin';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ message: string; isSuccessful: boolean }>;
    logout: () => void;
    userData: User | null;
    userRole: Roles;
}

const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    login: () => Promise.resolve({ message: '', isSuccessful: false }),
    logout: () => {},
    userData: null,
    userRole: 'user',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<Roles>('user');
    const navigate = useNavigate();
    const location = useLocation();

    /*useEffect(() => {
        const validateSession = async () => {
            const token = getToken();

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            const { isTokenValid } = await getUserInfo(token);

            if (!isTokenValid) {
                setIsAuthenticated(false);
                return;
            }

            setIsAuthenticated(true);
            const nextRoute = location.pathname === "/" ? "/assigned-sensors" : location.pathname;
            navigate(nextRoute);
        };

        validateSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); */ 
    useEffect(() => {
    // 🚨 Este bloque omite la validación del token
    setIsAuthenticated(true);
    const nextRoute = location.pathname === "/" ? "/assigned-sensors" : location.pathname;
    navigate(nextRoute);
},); 
    

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email, contraseña: password }),
            });

            // if (!response.ok) {
            //     console.log('Error en la petición');
            //     // throw new Error('Error en la petición');
            //     if (response.status === 401) {

            //     }
            // }

            const data = await response.json();
            if (data.message === 'Login exitoso') {
                const { isTokenValid } = await getUserInfo(data.token);

                if (!isTokenValid) {
                    setIsAuthenticated(false);
                    return { message: 'Ha ocurrido un error', isSuccessful: false };
                }

                saveToken(data.token);
                setIsAuthenticated(true);
                navigate("/assigned-sensors")
                return { message: 'Login exitoso', isSuccessful: true };
            }

            if (data.message === 'Credenciales inválidas') {
                return { message: 'Credenciales inválidas', isSuccessful: false };
            }

            return { message: 'Ha ocurrido un error', isSuccessful: false };
        } catch {
            setIsAuthenticated(false);
            return { message: 'Ha ocurrido un error', isSuccessful: false };
        }
    };

    const saveToken = (token: string) => {
        localStorage.setItem('artifields-token', token);
    };

    const getToken = () => localStorage.getItem('artifields-token');

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('artifields-token');
        navigate('/');
    };

    const getUserInfo = async (token: string) => {
        if (!token) {
            setIsAuthenticated(false);
            return { isTokenValid: false };
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/users/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                return { isTokenValid: false };
            }

            const data: User = await response.json();
            setUserData(data);
            // setUserRole('superadmin');
            switch (data.tipo_usuario) {
                case 1:
                    setUserRole('user');
                    break;
                case 2:
                    setUserRole('admin');
                    break;
                case 3:
                    setUserRole('superadmin');
                    break;
                default:
                    setUserRole('user');
                    break;
            }

            return { isTokenValid: true };
        } catch {
            return { isTokenValid: false };
        }
    };

    return (
        <AuthContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                isAuthenticated,
                login,
                logout,
                userData,
                userRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
