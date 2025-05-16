import {Outlet, Navigate} from 'react-router-dom';

import { useAuth, type Roles } from 'src/context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: Roles[] }) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
};