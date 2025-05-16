import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetAllRanchesWithSensors, GetAllSensorsWithoutRanch, GetUsersInRanchSchema} from "./schema";

export const getAllRanchesWithSensors = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/with-sensores`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();
        const parsedArray = json.map((item: any) => {
            try {
                return {
                    ...item,
                    area: item.area ? JSON.parse(item.area) : null,
                };
            } catch (error) {
                console.error("Failed to parse area for item:", item, error);
                return {
                    ...item,
                    area: null,
                };
            }
        });
        return GetAllRanchesWithSensors.parse(parsedArray);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const getAllSensorsWithoutRanch = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/unassigned-sensores`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllSensorsWithoutRanch.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const moveSensorToRanch = async (sensorId: number, ranchId: number) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/assign-sensor`, {
            method: 'POST',
            body: JSON.stringify({
                "rancho_id": ranchId,
                "sensor_id": sensorId,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Sensor asignado al rancho exitosamente.") {
            throw new Error("Ha ocurrido un error al asignar el sensor")
        }
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const removeSensorFromRanch = async (sensorId: number) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/unassign-sensores`, {
            method: 'PUT',
            body: JSON.stringify({
                "sensor_ids": [sensorId],
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Sensores desasignados exitosamente.") {
            throw new Error("Ha ocurrido un error al asignar el sensor")
        }
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const createNewRanch = async (
    name: string,
    lat: number,
    long: number,
    coordinatesArea: google.maps.LatLngLiteral[][]
) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/create`, {
            method: 'POST',
            body: JSON.stringify({
                "nombre": name,
                "lat": lat,
                "long": long,
                "area": {
                    "tipo": "polígono",
                    "coordenadas": coordinatesArea
                }
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Rancho creado exitosamente") {
            throw new Error("Ha ocurrido un error al asignar el sensor")
        }
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const editRanch = async (
    name: string,
    lat: number,
    long: number,
    coordinatesArea: google.maps.LatLngLiteral[][],
    ranchId: number,
) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/update/${ranchId}`, {
            method: 'PUT',
            body: JSON.stringify({
                "nombre": name,
                "lat": lat,
                "long": long,
                "area": {
                    "tipo": "polígono",
                    "coordenadas": coordinatesArea
                }
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Rancho actualizado exitosamente.") {
            throw new Error("Ha ocurrido un error al asignar el sensor")
        }
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const assignRanchToUser = async (ranchId: number, usersId: number[]) => {
    try {
        const assignmentPromises = usersId.map(async (userId) => {
            const res = await fetch(`${BACKEND_URL}/api/rancho/assign-user`, {
                method: 'POST',
                body: JSON.stringify({
                    "user_id": userId,
                    "rancho_id": ranchId,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to assign ranch to user ${userId}`);
            }

            const json = await res.json();

            if (json.message !== "Rancho asignado al usuario exitosamente.") {
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


export const getUsersInRanch = async (ranchId: number) => {
    if (!ranchId) {
        throw new Error("No ranch id found.");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/${ranchId}/usuarios`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }

        const json = await res.json();

        if (json.message !== "Usuarios recuperados exitosamente") {
            throw new Error("No se pudieron recuperar los usuarios")
        }

        return GetUsersInRanchSchema.parse(json);
    } catch (e) {
        throw new Error(`Failed to move sensor to Ranch: ${e}`);
    }
}

export const unassignRanchToUser = async (ranchId: number, usersId: number[]) => {
    try {
        const assignmentPromises = usersId.map(async (userId) => {
            const res = await fetch(`${BACKEND_URL}/api/rancho/unassign-user`, {
                method: 'DELETE',
                body: JSON.stringify({
                    "user_id": userId,
                    "rancho_id": ranchId,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to assign ranch to user ${userId}`);
            }

            const json = await res.json();

            if (json.message !== "La asignación del rancho al usuario se eliminó exitosamente.") {
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