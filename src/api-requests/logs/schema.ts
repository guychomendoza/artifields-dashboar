import {z} from "zod";

export const GetSensorLogsSchema = z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    data: z.array(
        z.object({
            id: z.number(),
            title: z.string(),
            json: z.string(),
            hora: z.string(),
        })
    )
})

export type SensorLog = z.infer<typeof GetSensorLogsSchema>["data"][number];