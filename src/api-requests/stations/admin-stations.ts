import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetStationHistorySchema, GetAllStationsLastMeasuringSchema, GetUsersInStations} from "./schema";
import {GetUsersInRanchSchema} from "../ranches/schema";

export const getAllStationsLastMeasuring = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/weather-datas/latest-all`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllStationsLastMeasuringSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const getStationHistory = async (deviceId: string) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/weather-data/${deviceId}`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetStationHistorySchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const assignStationToUser = async (devEui: string, usersId: number[]) => {
    try {
        const assignmentPromises = usersId.map(async (userId) => {
            const res = await fetch(`${BACKEND_URL}/api/user-stations/assign`, {
                method: 'POST',
                body: JSON.stringify({
                    "user_id": userId,
                    "devEui": devEui,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to assign ranch to user ${userId}`);
            }

            const json = await res.json();
            if (json.message !== "Estación asignada al usuario con éxito") {
                 throw new Error(`Error assigning ranch to user ${userId}: ${json.message}`);
            }

            return json;
        });

        await Promise.all(assignmentPromises);

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }

        throw error;
    }
}


export const getUsersInStations = async (stationDevEui: string) => {
    if (!stationDevEui) {
        throw new Error("No ranch id found.");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/user-stations/stations/${stationDevEui}/users`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }

        const json = await res.json();

        if (json.message !== "Usuarios asignados y no asignados a la estación") {
            throw new Error("No se pudieron recuperar los usuarios")
        }

        return GetUsersInStations.parse(json);
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const unassignStationToUser = async (devEui: string, usersId: number[]) => {
    try {
        const assignmentPromises = usersId.map(async (userId) => {
            const res = await fetch(`${BACKEND_URL}/api/user-stations/stations/${devEui}/users/${userId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error(`Failed to assign ranch to user ${userId}`);
            }

            const json = await res.json();
            if (json.message !== "Desasignación realizada con éxito") {
                 throw new Error(`Error assigning ranch to user ${userId}: ${json.message}`);
            }

            return json;
        });

        await Promise.all(assignmentPromises);

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }

        throw error;
    }
}