import {z} from "zod";

import {OPEN_WEATHER_API_KEY, OPEN_WEATHER_API_URL} from "../api-url";
import {GetUserCurrentWeatherInfoSchema, GetUserCurrentWeatherInfoForecastSchema} from "./schema";

export const getUserCurrentWeatherInfo = async(lat: number, long:number) => {
    if (!lat || !long) {
        throw new Error("Missing lat or long");
    }

    try {
        const res = await fetch(`${OPEN_WEATHER_API_URL}/weather?lat=${lat}&lon=${long}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetUserCurrentWeatherInfoSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(`Failed to get webhooks: ${error}`)
    }

}

export const getUserCurrentWeatherInfoForecast = async(lat: number, long:number) => {
    if (!lat || !long) {
        throw new Error("Missing lat or long");
    }

    try {
        const res = await fetch(`${OPEN_WEATHER_API_URL}/forecast?lat=${lat}&lon=${long}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetUserCurrentWeatherInfoForecastSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(`Failed to get webhooks: ${error}`)
    }

}