import {z} from "zod";

import {WEATHER_API_URL} from "../api-url";
import {GetUserLocationWeatherForecastSchema} from "./schemas";

export interface UserLocation {
    latitude: number;
    longitude: number;
}

export const getUserLocation = async (): Promise<UserLocation> =>
    // eslint-disable-next-line no-async-promise-executor
     new Promise<UserLocation>(async (resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position: GeolocationPosition) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                async (error: GeolocationPositionError) => {
                    console.warn("Geolocation failed, using IP-based location...", error);
                    try {
                        const res = await fetch("https://ipapi.co/json/");
                        if (!res.ok) {
                            throw new Error("Network response was not ok");
                        }
                        const json = await res.json();
                        resolve({
                            latitude: json.latitude,
                            longitude: json.longitude,
                        });
                    } catch (ipError) {
                        reject(new Error("Failed to get location from both geolocation and IP."));
                    }
                }
            );
        } else {
            console.warn("Geolocation is not supported, using IP-based location...");
            try {
                const res = await fetch("https://ipapi.co/json/");
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const json = await res.json();
                resolve({
                    latitude: json.latitude,
                    longitude: json.longitude,
                });
            } catch (ipError) {
                reject(new Error("Failed to get location."));
            }
        }
    })
;


export const getUserLocationWeatherForecast = async (latitude: number, longitude: number) => {
        try {
            if (!WEATHER_API_URL) {
                throw new Error("API key is missing");
            }

            const weatherResponse = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_URL}&q=${latitude},${longitude}&days=1&aqi=no`
            );

            if (!weatherResponse.ok) {
                throw new Error("Weather response was not ok")
            }

            const weatherData = await weatherResponse.json()
            return GetUserLocationWeatherForecastSchema.parse(weatherData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation error:', error.errors);
                throw new Error(error.message);
            }
            throw new Error(error);
        }
}