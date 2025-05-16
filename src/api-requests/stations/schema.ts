import {z} from "zod";

export const stationLastMeasurementSchema = z.object({
    devEui: z.string(),
    deviceName: z.string(),
    humidity: z.number().nullable(),
    id: z.number(),
    light: z.number().nullable(),
    pressure: z.number().nullable(),
    rainfall: z.number().nullable(),
    rssi: z.number().nullable(),
    snr: z.string().nullable(),
    temperature: z.number().nullable(),
    timestamp: z.string(),
    uv: z.number().nullable(),
    windDirection: z.number().nullable(),
    windSpeed: z.number().nullable(),
})

export const stationInfoSchema = z.object({
    area: z.string().nullable(),
    devEui: z.string(),
    deviceName: z.string(),
    grupoName: z.string(),
    id: z.number(),
    lat: z.string(),
    long: z.string(),
})

export const getUserStationsWithLatestDataSchema = z.object({
    data: z.array(
        z.object({
            area: z.string().nullable(),
            devEui: z.string(),
            deviceName: z.string(),
            grupoName: z.string(),
            id: z.number(),
            lat: z.string(),
            long: z.string(),
            latestMeasurement: stationLastMeasurementSchema
        })
    ),
    message: z.string()
})
export type getUserStationsWithLatestDataItem = z.infer<typeof  getUserStationsWithLatestDataSchema>["data"][number]
export const getUserStationsWithLatestDataItemSchema = z.object({
    area: z.string().nullable(),
    devEui: z.string(),
    deviceName: z.string(),
    grupoName: z.string(),
    id: z.number(),
    lat: z.string(),
    long: z.string(),
    latestMeasurement: stationLastMeasurementSchema
})

export const GetAllStationsLastMeasuringSchema = z.object({
    message: z.string(),
    data: z.array(
        z.object({
            latestData: stationLastMeasurementSchema,
            station: stationInfoSchema
        })
    )
})

export const StationItemSchema = z.object({
    latestData: stationLastMeasurementSchema,
    station: stationInfoSchema
})
export type StationItem = z.infer<typeof StationItemSchema>

export const GetLastMeasurementStationByDeviceIdSchema = z.object({
    message: z.string(),
    latestData: stationLastMeasurementSchema,
    station: stationInfoSchema
})

export const GetStationHistorySchema = z.object({
    message: z.string(),
    data: z.array(stationLastMeasurementSchema)
})


export const GetUsersInStations = z.object({
    message: z.string(),
    data: z.object({
        station: z.object({
            id: z.number(),
            devEui: z.string(),
            deviceName: z.string().nullable(),
            grupoName: z.string().nullable(),
            lat: z.number().nullable(),
            long: z.number().nullable(),
            area: z.string().nullable(),
        }),
        assignedUsers: z.array(
            z.object({
                id: z.number(),
                nombre: z.string().nullable(),
                correo: z.string(),
                tipo_usuario: z.number().nullable(),
            })
        ),
        unassignedUsers: z.array(
            z.object({
                id: z.number(),
                nombre: z.string().nullable(),
                correo: z.string(),
                tipo_usuario: z.number().nullable(),
            })
        )
    })
}).transform((station) => ({
    message: station.message,
    data: {
        station: station.data.station,
        assigned: station.data.assignedUsers.map((user) => ({
            id: user.id,
            name: user.nombre,
            email: user.correo,
            userType: user.tipo_usuario
        })),
        notAssigned: station.data.unassignedUsers.map((user) => ({
            id: user.id,
            name: user.nombre,
            email: user.correo,
            userType: user.tipo_usuario
        })),
    }
}))