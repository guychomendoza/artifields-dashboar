import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {
    getUserStationsWithLatestDataSchema,
    GetLastMeasurementStationByDeviceIdSchema
} from "./schema";


export const getUserStationsWithLatestData = async (userId?: number) => {
    if (!userId) {
        throw new Error("No userId was provided");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/user-stations/${userId}/with-latest-data`);
        if (!res.ok) {
            const errorMessage = await res.json();
            if (errorMessage?.message === "No se encontraron estaciones asignadas para este usuario") {
                throw new Error("Sin estaciones asignadas")
            }
            throw new Error("Network response was not ok")
        }

        const json = await res.json();
        return getUserStationsWithLatestDataSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Ha ocurrido un error al validar los datos");
            throw new Error(error.message);
        }
        throw new Error(error.message);
    }
}

export const getLastMeasurementStationByDeviceId = async (deviceId: string | undefined) => {
    if (!deviceId) {
        throw new Error("No deviceId was provided");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/weather-data/${deviceId}/latest`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }

        const json = await res.json();
        return GetLastMeasurementStationByDeviceIdSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}