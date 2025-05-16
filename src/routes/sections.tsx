import { lazy, Suspense } from 'react';
import {Outlet, Navigate, useRoutes} from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { ProtectedRoute } from './protected-route';



// ----- USER -----
const ForecastPage = lazy(() => import("src/pages/forecast"));
const RanchesPage = lazy(() => import("src/pages/ranches"));

// ----- ADMIN -----
const SensorsPage = lazy(() => import('src/pages/sensors'));

// ----- SUPERADMIN -----
const WhatsAppPage = lazy(() => import('src/pages/whatsapp'));
const WebhooksPage = lazy(() => import('src/pages/webhooks'));
const AlertsPage = lazy(() => import('src/pages/alerts'));
const EmailsPage = lazy(() => import('src/pages/emails'));

export const ProjectsPage = lazy(() => import('src/pages/projects'));
export const AnalysisResultPage = lazy(() => import('src/pages/analysis-result'));
export const MapPage = lazy(() => import('src/pages/map'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterUserPage = lazy(() => import('src/pages/register-user'));
export const SensorsReport = lazy(() => import('src/pages/sensors-report'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const IOTSensorPage = lazy(() => import('src/pages/iot-sensor'));
export const AssignedSensorsPage = lazy(() => import('src/pages/assigned-sensors'));
export const Users = lazy(() => import('src/pages/users'));
export const Profile = lazy(() => import('src/pages/profile'));
export const Cms = lazy(() => import('src/pages/cms'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const LogsPage = lazy(() => import('src/pages/logs'));
export const WeatherStationsPage = lazy(() => import('src/pages/weather-stations'));

// ----------------------------------------------------------------------

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export function Router() {

    return useRoutes([
        {
            element: (
                <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                {
                    element: <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']} />,
                    children: [
                        { path: 'iot/sensor/:sensorId', element: <IOTSensorPage /> },
                        { path: 'assigned-sensors', element: <AssignedSensorsPage /> },
                        { path: 'profile', element: <Profile /> },
                        { path: 'forecast', element: <ForecastPage /> },
                        { path: 'weather-stations/:stationId', element: <WeatherStationsPage /> },
                        { path: 'ranch/:ranchName', element: <RanchesPage /> }
                    ],
                },
                // {
                //     element: <ProtectedRoute allowedRoles={['user2', 'admin', 'superadmin']} />,
                //     children: [{ path: 'sensors-report', element: <SensorsReport /> }],
                // },
                {
                    element: <ProtectedRoute allowedRoles={['admin', 'superadmin']} />,
                    children: [
                        { path: 'projects', element: <ProjectsPage /> },
                        { path: 'analysis-result/:id', element: <AnalysisResultPage /> },
                        { path: 'map', element: <MapPage /> },
                        { path: 'sensors-report', element: <SensorsReport /> },
                        { path: 'sensors', element: <SensorsPage /> },
                    ],
                },
                {
                    element: <ProtectedRoute allowedRoles={['superadmin']} />,
                    children: [
                        {
                            path: 'register',
                            element: <RegisterUserPage />,
                            children: [{ path: 'new', element: <RegisterUserPage /> }],
                        },
                        {
                            path: 'users',
                            element: <Users />,
                        },
                        {
                            path: 'cms',
                            element: <Cms />,
                        },
                        {
                            path: 'logs',
                            element: <LogsPage />
                        },
                        {
                            path: "whatsapp",
                            element: <WhatsAppPage />
                        },
                        {
                            path: "webhooks",
                            element: <WebhooksPage />
                        },
                        {
                            path: "alerts",
                            element: <AlertsPage />
                        },
                        {
                            path: "emails",
                            element: <EmailsPage />
                        }
                    ],
                },
                {},
            ],
        },
        {
            path: "/",
            element:(
                <AuthLayout>
                    <Suspense fallback={renderFallback}>
                        <SignInPage />
                    </Suspense>
                </AuthLayout>
            ),
            index: true,
        },
        {
            path: "reset-password/:token",
            element: <ResetPasswordPage />
        },

        {
            path: '404',
            element: <Page404 />,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);
}
