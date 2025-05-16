import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import { GetAllSensorsLastMeasuringSchema, GetAllSensorsSchema } from './schema';


export const getAllSensorsLastMeasuring = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/sensors/ultima-medicion-unica`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllSensorsLastMeasuringSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const getAllSensors = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/sensores`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllSensorsSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}