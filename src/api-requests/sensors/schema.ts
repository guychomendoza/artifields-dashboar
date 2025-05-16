import { z } from "zod";


export const sensorLastMeasurementSchema = z.object({
    agua_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
    aplicacion_id: z.string().nullable(),
    banda_id: z.string().nullable(),
    bateria: z.string().nullable(),
    conductividad_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
    dispositivo_id: z.string(),
    id: z.number(),
    modelo_id: z.string().nullable(),
    nombre_dispositivo: z.string().nullable(),
    rssi: z.number().nullable(),
    snr: z.string().nullable().transform(Number).pipe(z.number()),
    temperatura_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
    timestamp: z.string(),
})

export const transformedSensorLastMeasurementSchema = z.object({
    soilWater: z.number().nullable(),
    applicationId: z.string().nullable(),
    bandId: z.string().nullable(),
    battery: z.string().nullable(),
    soilConductivity: z.number().nullable(),
    deviceId: z.string(),
    id: z.number(),
    modelId: z.string().nullable(),
    deviceName: z.string().nullable().nullable(),
    rssi: z.number().nullable(),
    snr: z.number().nullable(),
    soilTemperature: z.number().nullable(),
    timestamp: z.string(),
});
export type SensorItemLastMeasurement = z.infer<typeof transformedSensorLastMeasurementSchema>;

export const GetAllSensorsLastMeasuringSchema = z.array(
    sensorLastMeasurementSchema.transform((obj) => ({
            soilWater: obj.agua_suelo,
            applicationId: obj.aplicacion_id,
            bandId: obj.banda_id,
            battery: obj.bateria,
            soilConductivity: obj.conductividad_suelo,
            deviceId: obj.dispositivo_id,
            id: obj.id,
            modelId: obj.modelo_id,
            deviceName: obj.nombre_dispositivo,
            rssi: obj.rssi,
            snr: obj.snr,
            soilTemperature: obj.temperatura_suelo,
            timestamp: obj.timestamp,
    }))
);


export const userSensorSchema = z.object({
    deviceId: z.string(),
    groupId: z.number().nullable(),
    groupName: z.string().nullable(),
    lat: z.number().nullable(),
    long: z.number().nullable(),
    deviceName: z.string().nullable(),
    lastMeasurement: z.object({
        soilWater: z.number().nullable(),
        applicationId: z.string().nullable(),
        bandId: z.string().nullable(),
        battery: z.number().nullable(),
        soilConductivity: z.number().nullable(),
        deviceId: z.string(),
        id: z.number(),
        modelId: z.string().nullable(),
        rssi: z.number().nullable(),
        snr: z.number().nullable(),
        soilTemperature: z.number().nullable(),
        timestamp: z.string(),
    })
})
export type UserSensorItemLastMeasurement = z.infer<typeof userSensorSchema>;


export const GetAllUsersSensorsByIdSchema = z.array(
    z.object({
        dispositivo_id: z.string(),
        grupo_id: z.number().nullable(),
        grupo_name: z.string().nullable(),
        latitud: z.string().transform(Number).pipe(z.number()).nullable(),
        longitud: z.string().transform(Number).pipe(z.number()).nullable(),
        nombre_dispositivo: z.string().nullable(),
        primera_medicion: z.object({
            agua_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            aplicacion_id: z.string().nullable(),
            banda_id: z.string().nullable(),
            bateria: z.string().transform(Number).pipe(z.number()).nullable(),
            conductividad_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            dispositivo_id: z.string(),
            id: z.number(),
            modelo_id: z.string().nullable(),
            rssi: z.number().nullable(),
            snr: z.string().nullable().transform(Number).pipe(z.number()),
            temperatura_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            timestamp: z.string(),
        })
    }).transform((obj) => ({
        deviceId: obj.dispositivo_id,
        groupId: obj.grupo_id,
        groupName: obj.grupo_name,
        lat: obj.latitud,
        long: obj.longitud,
        deviceName: obj.nombre_dispositivo,
        lastMeasurement: {
            soilWater: obj.primera_medicion.agua_suelo,
            applicationId: obj.primera_medicion.aplicacion_id,
            bandId: obj.primera_medicion.banda_id,
            battery: obj.primera_medicion.bateria,
            soilConductivity: obj.primera_medicion.conductividad_suelo,
            deviceId: obj.primera_medicion.dispositivo_id,
            id: obj.primera_medicion.id,
            modelId: obj.primera_medicion.modelo_id,
            rssi: obj.primera_medicion.rssi,
            snr: obj.primera_medicion.snr,
            soilTemperature: obj.primera_medicion.temperatura_suelo,
            timestamp: obj.primera_medicion.timestamp,
        }
    }))
)

export const GetAllSensorsSchema = z.array(
    z.object({
        id: z.number(),
        device_id: z.string(),
        lat: z.string().transform(Number).pipe(z.number()).nullable(),
        long: z.string().transform(Number).pipe(z.number()).nullable(),
        nombre: z.string().nullable(),
        limite_superior: z.number().nullable(),
        limite_inferior: z.number().nullable(),
        coordenadas: z.string().nullable(),
        capacidadIdeal: z.string().transform(Number).pipe(z.number()).nullable(),
        rancho_id: z.number().nullable(),
        rancho: z.object({
            id: z.number(),
            nombre: z.string().nullable(),
        }).nullable(),
    }).transform((obj) => ({
        id: obj.id,
        deviceId: obj.device_id,
        lat: obj.lat,
        lng: obj.long,
        name: obj.nombre,
        topLimit: obj.limite_superior,
        bottomLimit: obj.limite_inferior,
        coordinates: obj.coordenadas,
        idealCapacity: obj.capacidadIdeal,
        ranchId: obj.rancho_id,
        ranchName: obj?.rancho?.nombre || null,
    }))
)
export type SensorInfo = z.infer<typeof GetAllSensorsSchema>[number];