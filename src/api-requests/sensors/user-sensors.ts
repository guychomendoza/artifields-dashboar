import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetAllUsersSensorsByIdSchema} from "./schema";

export const getAllUsersSensorsById = async (userId?: number) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/sensors/usuario/${userId}/sensores-primera-insercion`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllUsersSensorsByIdSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}