import type {z} from "zod";

import type {stationLastMeasurementSchema, getUserStationsWithLatestDataSchema} from "./stations/schema";

export interface Project {
    id: number;
    name: string;
    status: boolean;
}

export interface ProjectAnalysis extends Project {
    images: ImageResult[];
}

export type ImageResult = {
    image: string;
    latitude: string;
    longitude: string;
    url_detected: string;
    url_original: string;
}

type ModelUsage = {
    completion_tokens: number;
    completion_tokens_details: {
        reasoning_tokens: number;
    }
    prompt_tokens: number;
    prompt_tokens_details: {
        cached_tokens: number;
    }
    total_tokens: number;
}

type Choice = {
    finish_reason: string;
    index: number;
    logprobs: null;
    message: {
        content: string;
        refusal: null;
        role: string;
    }
}

export type ImageAnalysis = {
    choices: Choice[];
    created: number;
    id: string;
    model: string;
    objects: string;
    system_fingerprint: string;
    usage: ModelUsage;
}

export type ReportResponse = {
    id: number;
    file_name: string;
    image_url: string;
    pdf_url: string;
    suggestions: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}


export type DeviceRead = DeviceGroup & {
    device_id: string;
    lat: string | number;
    long: string | null;
    limite_inferior: number | null;
    limite_superior: number | null;
    nombre: string | null;
}

export type DeviceGroup = {
    grupo_id: number;
    grupo_name: string;
}

export type SensorWithName = {
    agua_suelo: string;
    aplicacion_id: string;
    banda_id: string;
    bateria: string;
    conductividad_suelo: string;
    dispositivo_id: string;
    id: number;
    modelo_id: string;
    temperatura_suelo: string;
    timestamp: string;
    nombre_dispositivo: string | null;
}

export type Sensor = {
    agua_suelo: string;
    aplicacion_id: string;
    banda_id: string;
    bateria: string;
    conductividad_suelo: string;
    dispositivo_id: string;
    id: number;
    modelo_id: string;
    temperatura_suelo: string;
    timestamp: string;
}

export type SensorInfo = {
    capacidadIdeal: string | null;
    coordenadas: string | null;
    device_id: string;
    grupo_id: number | null;
    grupo_name: string | null;
    id: number;
    lat: string | null;
    long: string | null;
    nombre: string | null;
    limite_inferior: number | null;
    limite_superior: number | null;
}

export type LastSensorMeasurement = {
    ultimaMedicion: Sensor;
    sensorInfo: SensorInfo;
}

export type UnassignedSensor = {
    device_id: string;
    grupo_id: number;
    grupo_name: string;
    id: number;
    lat: number | null;
    lon: number | null;
}

type SensorDetails = {
    device_id: string;
    lat: string | null;
    long: string | null;
    nombre: string;
    capacidadIdeal: string | null;
    limite_inferior: number | null;
    limite_superior: number | null;
}

export type UserSensor = {
    capacidadIdeal: string | null;
    device_id: string;
    lat: string | null;
    long: string | null;
    limite_inferior: number | null;
    limite_superior: number | null;
    nombre: string | null;
    last_measurement: {
        agua_suelo: string;
        aplicacion_id: string;
        banda_id: string;
        bateria: string;
        conductividad_suelo: string;
        dispositivo_id: string;
        id: number;
        modelo_id: string;
        temperatura_suelo: string;
        timestamp: string;
    }
    rancho_id: number | null;
    rancho: {
        id: number;
        nombre: string|null;
        ubicacion: {
            lat: string | null;
            long: string | null;
        }
        area: string|null;
    } | null
}

export type SensorWithColor = UserSensor & { color: string };

export type User = {
    contraseña: string;
    correo: string;
    fecha_creacion: string;
    fecha_ultimo_pago: string | null;
    foto_perfil: string | null;
    id: number;
    nombre: string;
    pago_realizado: boolean;
    tipo_usuario: number;
    ultima_actualizacion: string;
    chatbot_whats: boolean;
    telefono: string | null;
};

export type TokenUser = {
    correo: string;
    id: number;
    nombre: string;
    reset_password_expires: string;
    reset_password_token: string;
};

export type AssignedSensor = {
    device_id: string;
    sensor_id: string;
    user_id: number;
    user_name: string;
};

export type WeatherData = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
};

export type ForecastWeather = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    }
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    }
    forecast: {
        forecastday: {
            astro: {
                is_moon_up: number;
                is_sun_up: number;
                moon_illumination: number;
                moon_phase: string;
                moonrise: string;
                moonset: string;
                sunrise: string;
                sunset: string;
            }
            date: string;
            date_epoch: number;
            day: {
                avghumidity: number;
                avgtemp_c: number;
                avgtemp_f: number;
                avgvis_km: number;
                avgvis_miles: number;
                condition: {
                    code: number;
                    icon: string;
                    text: string;
                };
                daily_chance_of_rain: number;
                daily_chance_of_snow: number;
                daily_will_it_rain: number;
                daily_will_it_snow: number;
                maxtemp_c: number;
                maxtemp_f: number;
                maxwind_kph: number;
                maxwind_mph: number;
                mintemp_c: number;
                mintemp_f: number;
                totalprecip_in: number;
                totalprecip_mm: number;
                totalsnow_cm: number;
                uv: number;
            }
            hour: {
                chance_of_rain: number;
                chance_of_snow: number;
                cloud: number;
                condition: {
                    code: number;
                    icon: string;
                    text: string;
                };
                dewpoint_c: number;
                dewpoint_f: number;
                feelslike_c: number;
                feelslike_f: number;
                gust_kph: number;
                gust_mph: number;
                heatindex_c: number;
                heatindex_f: number;
                humidity: number;
                is_day: number;
                precip_in: number;
                precip_mm: number;
                pressure_in: number;
                pressure_mb: number;
                snow_cm: number;
                temp_c: number;
                temp_f: number;
                time: string;
                time_epoch: number;
                uv: number;
                vis_km: number;
                vis_miles: number;
                will_it_rain: number;
                will_it_snow: number;
                wind_degree: number;
                wind_dir: string;
                wind_kph: number;
                wind_mph: number;
                windchill_c: number;
                windchill_f: number;
            }[]
        }[]
    }
}

export interface AssignedUserSensor {
    dispositivo_id: string;
    grupo_id: number | null;
    grupo_name: string | null;
    latitud: number | null;
    longitud: number | null;
    nombre_dispositivo: string | null;
    primera_medicion: {
        agua_suelo: string;
        aplicacion_id: string;
        banda_id: string | null;
        bateria: string;
        conductividad_suelo: string;
        dispositivo_id: string;
        id: number;
        modelo_id: string;
        temperatura_suelo: string | null;
        timestamp: string;
    };
}

// *******************************************************************

export type GroupWithSensors = Record<string, {
    "device_id": string;
    "grupo_id": string;
    "grupo_name": string;
    "lat": string;
    "long": string;
    "nombre": string;
}>;


// *************** ZOD TYPES
export type StationWithLatestData = z.infer<typeof getUserStationsWithLatestDataSchema>['data'][number];
export type StationLatestData = z.infer<typeof stationLastMeasurementSchema>