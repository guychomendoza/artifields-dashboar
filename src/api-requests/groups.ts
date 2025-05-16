import {z} from "zod";

import { BACKEND_URL } from './api-url';

const SensorWithRanchSchema = z.object({
    device_id: z.string(),
    grupo_id: z.number().nullable(),
    grupo_name: z.string().nullable(),
    lat: z.string().nullable(),
    long: z.string().nullable(),
    nombre: z.string().nullable()
}).transform((data) => ({
    deviceId: data.device_id,
    groupId: data.grupo_id,
    groupName: data.grupo_name,
    latitude: data.lat ? Number(data.lat) : null,
    longitude: data.long ? Number(data.long) : null,
    name: data.nombre,
}));

// Schema for the entire response (Record/dictionary of ranches)
export const RanchesResponseSchema = z.record(z.string(), z.array(SensorWithRanchSchema));
export type TransformedRanch = z.infer<typeof SensorWithRanchSchema>;
// export type TransformedRanches = z.infer<typeof RanchesResponseSchema>;

export type StructuredRanchesWithSensors = {
    ranch: string;
    sensors: TransformedRanch[];
}[]

export const fetchAllRanches = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/sensors/agrupados-por-grupo/grupo`);
        if (!res.ok) {
            throw new Error ("Network response was not ok")
        }
        const data = await res.json();
        const parsedData = RanchesResponseSchema.parse(data);

        return Object.entries(parsedData).map(([key, value]) => ({
            ranch: key,
            sensors: value
        }))

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
};