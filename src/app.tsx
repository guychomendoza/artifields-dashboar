import 'src/global.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient()

export default function App() {
    useScrollToTop();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ThemeProvider>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
