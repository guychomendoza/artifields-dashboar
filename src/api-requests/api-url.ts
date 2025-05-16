export const BACKEND_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:4000'
        : import.meta.env.VITE_BACKEND_API_URL;

export const PYTHON_API_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:5000'
        : import.meta.env.VITE_PYTHON_API_URL;

export const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_KEY;

export const OPEN_WEATHER_API_URL = import.meta.env.VITE_OPEN_WEATHER_URL;
export const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;