import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetUserRanches, GetUserSensorsByRanchSchema} from "./schema";

export const getUserRanches = async (userId: number|undefined) => {
    if (!userId) {
        throw new Error("userId must be provided");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/user/${userId}`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();
        return GetUserRanches.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("Se ha producido un error al validar los datos");
        }
        throw new Error(error);
    }

}

export const getUserSensorsByRanch = async (ranchId: number) => {
    if (!ranchId) {
        throw new Error("userId must be provided");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/rancho/${ranchId}/ultimas-mediciones`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message === "El rancho no tiene sensores asignados") {
            throw new Error("Rancho sin sensores asignados")
        }

        if (json.message !== "Datos recuperados exitosamente") {
            throw new Error("Ha ocurrido un error al obtener los datos del rancho")
        }
        return GetUserSensorsByRanchSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }

}