import { z } from 'zod';

const pointSchema = z.object({
    lat: z.number(),
    lng: z.number(),
});

const polygonSchema = z.object({
    tipo: z.literal('poligono'), // Enforce "poligono" type
    coords: z.array(pointSchema),
});

const areaSchema = z
    .string()
    .transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);
            // Validate the parsed object against the polygon schema
            const result = polygonSchema.safeParse(parsed);
            if (result.success) {
                return result.data; // Return the validated area object
            }
            return null; // If validation fails, return null
        } catch (e) {
            return null; // If JSON parsing fails, return null
        }
    })
    .nullable();

const deviceSchema = z
    .object({
        device_id: z.string(),
        grupo_id: z.number().nullable(),
        grupo_name: z.string(),
        lat: z.string().transform(Number).pipe(z.number()).nullable(),
        long: z.string().transform(Number).pipe(z.number()).nullable(),
        nombre: z.string().nullable(),
        capacidadIdeal: z.string().transform(Number).pipe(z.number()).nullable(),
        limite_inferior: z.number().nullable(),
        limite_superior: z.number().nullable(),
        coordenadas: z.string().nullable(),
        ultimaMedicion: z.object({
            id: z.number(),
            dispositivo_id: z.string(),
            aplicacion_id: z.string(),
            bateria: z.string().transform(Number).pipe(z.number()).nullable(),
            temperatura_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            conductividad_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            agua_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
            banda_id: z.string().nullable(),
            modelo_id: z.string().nullable(),
            timestamp: z.string().nullable(),
            rssi: z.number().nullable(),
            snr: z.string().transform(Number).pipe(z.number()).nullable(),
        }),
    })
    .transform((data) => ({
        deviceId: data.device_id,
        groupId: data.grupo_id,
        groupName: data.grupo_name,
        lat: data.lat,
        long: data.long,
        name: data.nombre,
        idealCapacity: data.capacidadIdeal,
        bottomLimit: data.limite_inferior,
        topLimit: data.limite_superior,
        areaCoordinates: data.coordenadas,
        lastMeasurement: {
            id: data.ultimaMedicion.id,
            deviceId: data.ultimaMedicion.dispositivo_id,
            applicationId: data.ultimaMedicion.aplicacion_id,
            battery: data.ultimaMedicion.bateria,
            soilTemperature: data.ultimaMedicion.temperatura_suelo,
            soilConductivity: data.ultimaMedicion.conductividad_suelo,
            soilMoisture: data.ultimaMedicion.agua_suelo,
            bandId: data.ultimaMedicion.banda_id,
            modelId: data.ultimaMedicion.modelo_id,
            timestamp: data.ultimaMedicion.timestamp,
            rssi: data.ultimaMedicion.rssi,
            snr: data.ultimaMedicion.snr,
        },
    }));

export const GetUserRanchesSchema = z.record(z.string(), z.array(deviceSchema));
export type SensorsOnRanch = z.infer<typeof deviceSchema>;

const sensorRanch = z.object({
    id: z.number(),
    device_id: z.string(),
    nombre: z.string().nullable(),
    lat: z.string().transform(Number).pipe(z.number()).nullable(),
    long: z.string().transform(Number).pipe(z.number()).nullable(),
});


export const GetAllRanchesWithSensors = z
    .array(
        z.object({
            id: z.number(),
            lat: z.string().transform(Number).pipe(z.number()).nullable(),
            long: z.string().transform(Number).pipe(z.number()).nullable(),
            nombre: z.string().nullable(),
            area: z
                .union([
                    z.string().transform((str) => {
                        try {
                            return JSON.parse(str);
                        } catch {
                            return null;
                        }
                    }),
                    z.object({ coordenadas: z.unknown() }).nullable(), // Accepts objects directly
                ])
                .pipe(
                    z
                        .object({
                            coordenadas: z.union([
                                z.array(z.array(z.number())), // [[lat, long], [lat, long]]
                                z.array(z.object({ lat: z.number(), lng: z.number() })), // [{ lat, lng }, { lat, lng }]
                                z.array(z.array(z.object({ lat: z.number(), lng: z.number() }))), // New format: array of arrays of objects
                            ]),
                        })
                        .nullable()
                ),
            sensores: z.array(
                z.object({
                    id: z.number(),
                    device_id: z.string(),
                    nombre: z.string().nullable(),
                    lat: z.string().transform(Number).pipe(z.number()).nullable(),
                    long: z.string().transform(Number).pipe(z.number()).nullable(),
                })
            ),
        })
    )
    .transform((ranches) =>
        ranches.map((ranch) => ({
            id: ranch.id,
            lat: ranch.lat,
            long: ranch.long,
            name: ranch.nombre,
            area: ranch.area
                ? {
                    coordinates: Array.isArray(ranch.area.coordenadas)
                        ? ranch.area.coordenadas.map((coord) =>
                            Array.isArray(coord)
                                ? coord.map((innerCoord) =>
                                    typeof innerCoord === 'number'
                                        // @ts-ignore
                                        ? { lat: innerCoord[0], lng: innerCoord[1] }
                                        : innerCoord
                                )
                                : coord
                        )
                        : [],
                }
                : null,
            sensors: ranch.sensores.map((sensor) => ({
                id: sensor.id,
                deviceId: sensor.device_id,
                name: sensor.nombre,
                lat: sensor.lat,
                long: sensor.long,
            })),
        }))
    );
export type SensorInRanch = z.infer<typeof GetAllRanchesWithSensors>[number]['sensors'][number];
export type RanchWithSensors = z.infer<typeof GetAllRanchesWithSensors>[number];
export type RanchWithoutSensors = Omit<RanchWithSensors, 'sensors'>;

export const GetAllSensorsWithoutRanch = z
    .array(
        z.object({
            device_id: z.string(),
            id: z.number(),
            lat: z.string().transform(Number).pipe(z.number()).nullable(),
            long: z.string().transform(Number).pipe(z.number()).nullable(),
            nombre: z.string().nullable(),
        })
    )
    .transform((sensors) =>
        sensors.map((sensor) => ({
            deviceId: sensor.device_id,
            id: sensor.id,
            lat: sensor.lat,
            long: sensor.long,
            name: sensor.nombre,
        }))
    );
export type SensorWithNoRanch = z.infer<typeof GetAllSensorsWithoutRanch>[number];

export const GetUserRanches = z
    .array(
        z.object({
            area: z.string().nullable(),
            id: z.number(),
            lat: z.string().transform(Number).pipe(z.number()).nullable(),
            long: z.string().transform(Number).pipe(z.number()).nullable(),
            nombre: z.string().nullable(),
        }).nullable()
    )
    .transform((ranches) =>
        ranches
            .filter((ranche) => ranche !== null)
            .map((ranche) => ({
                id: ranche.id,
                lat: ranche.lat,
                long: ranche.long,
                name: ranche.nombre,
                area: ranche.area,
            }))
    );


export const GetUserSensorsByRanchSchema = z
    .object({
        success: z.boolean(),
        data: z.array(
            z.object({
                sensor_id: z.number(),
                tipo: z.string().nullable(),
                dispositivo_id: z.string(),
                nombre: z.string().nullable(),
                ubicacion: z.object({
                    lat: z.string().transform(Number).pipe(z.number()).nullable(),
                    long: z.string().transform(Number).pipe(z.number()).nullable(),
                }),
                limites: z.object({
                    superior: z.number().nullable(),
                    inferior: z.number().nullable(),
                }),
                capacidadIdeal: z.string().transform(Number).pipe(z.number()).nullable(),
                ultima_medicion: z.object({
                    timestamp: z.string(),
                    bateria: z.string().transform(Number).pipe(z.number()).nullable(),
                    temperatura: z.string().transform(Number).pipe(z.number()).nullable(),
                    conductividad: z.string().transform(Number).pipe(z.number()).nullable(),
                    humedad: z.string().transform(Number).pipe(z.number()).nullable(),
                    señal: z.object({
                        rssi: z.number().nullable(),
                        snr: z.string().transform(Number).pipe(z.number()).nullable(),
                    }),
                }),
            })
        ),
        message: z.string(),
    })
    .transform((ranch) => ({
        success: ranch.success,
        message: ranch.message,
        data: ranch.data.map((sensor) => ({
            id: sensor.sensor_id,
            type: sensor.tipo,
            deviceId: sensor.dispositivo_id,
            name: sensor.nombre,
            lat: sensor.ubicacion.lat,
            long: sensor.ubicacion.long,
            topLimit: sensor.limites.superior,
            bottomLimit: sensor.limites.inferior,
            idealCapacity: sensor.capacidadIdeal,
            lastMeasurement: {
                timestamp: sensor.ultima_medicion.timestamp,
                battery: sensor.ultima_medicion.bateria,
                temperature: sensor.ultima_medicion.temperatura,
                conductivity: sensor.ultima_medicion.conductividad,
                soilMoisture: sensor.ultima_medicion.humedad,
                rssi: sensor.ultima_medicion.señal.rssi,
                snr: sensor.ultima_medicion.señal.snr,
            },
        })),
    }));

export type userSensorRanch = z.infer<typeof GetUserSensorsByRanchSchema>['data'][number];

export const GetUsersInRanchSchema = z
    .object({
        success: z.boolean(),
        message: z.string(),
        data: z.object({
            asignados: z.array(
                z.object({
                    correo: z.string(),
                    id: z.number(),
                    nombre: z.string().nullable(),
                    region: z.string().nullable(),
                    telefono: z.string().nullable(),
                })
            ),
            no_asignados: z.array(
                z.object({
                    correo: z.string(),
                    id: z.number(),
                    nombre: z.string().nullable(),
                    region: z.string().nullable(),
                    telefono: z.string().nullable(),
                })
            ),
        }),
    })
    .transform((ranch) => ({
        success: ranch.success,
        message: ranch.message,
        data: {
            assigned: ranch.data.asignados.map((sensor) => ({
                id: sensor.id,
                email: sensor.correo,
                name: sensor.nombre,
                region: sensor.region,
                phone: sensor.telefono,
            })),
            notAssigned: ranch.data.no_asignados.map((no_asignado) => ({
                id: no_asignado.id,
                email: no_asignado.correo,
                name: no_asignado.nombre,
                region: no_asignado.region,
                phone: no_asignado.telefono,
            })),
        },
    }));

export const GetClustersAndSensorsByRanchId = z.array(
    z.object({
        cluster: z
            .object({
                id: z.number(),
                rancho_id: z.number(),
                sensor_15_id: z.number().nullable(),
                sensor_30_id: z.number().nullable(),
                nombre: z.string().nullable(),
                color: z.string().nullable(),
                tipo: z.string().nullable(),
                lat: z.string().transform(Number).pipe(z.number()).nullable(),
                lng: z.string().transform(Number).pipe(z.number()).nullable(),
                area: areaSchema,
            })
            .transform((cluster) => ({
                id: cluster.id,
                ranchId: cluster.rancho_id,
                sensor15Id: cluster.sensor_15_id,
                sensor30Id: cluster.sensor_30_id,
                name: cluster.nombre,
                color: cluster.color,
                type: cluster.tipo,
                lat: cluster.lat,
                lng: cluster.lng,
                area: cluster.area ? { coordinates: cluster.area.coords } : null,
            })),
        sensor15: z
            .object({
                info: z
                    .object({
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
                    })
                    .nullable(),
                ultimaMedicion: z.object({
                    id: z.number(),
                    dispositivo_id: z.string(),
                    aplicacion_id: z.string().nullable(),
                    bateria: z.string().transform(Number).pipe(z.number()).nullable(),
                    temperatura_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    conductividad_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    agua_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    banda_id: z.string().nullable(),
                    modelo_id: z.string().nullable(),
                    timestamp: z.string().nullable(),
                    rssi: z.number().nullable(),
                    snr: z.string().transform(Number).pipe(z.number()).nullable(),
                }).nullable(),
            })
            .nullable()
            .transform((device15) =>
                device15
                    ? {
                          info: device15.info
                              ? {
                                    id: device15.info.id,
                                    deviceId: device15.info.device_id,
                                    name: device15.info.nombre,
                                    lat: device15.info.lat,
                                    lng: device15.info.long,
                                    topLimit: device15.info.limite_superior,
                                    bottomLimit: device15.info.limite_inferior,
                                    coordinates: device15.info.coordenadas,
                                    idalCapacity: device15.info.capacidadIdeal,
                                    ranchoId: device15.info.rancho_id,
                                }
                              : null,
                          lastMeasurement: device15.ultimaMedicion
                              ? {
                                    id: device15.ultimaMedicion.id,
                                    deviceId: device15.ultimaMedicion.dispositivo_id,
                                    applicationId: device15.ultimaMedicion.aplicacion_id,
                                    battery: device15.ultimaMedicion.bateria,
                                    soilTemperature: device15.ultimaMedicion.temperatura_suelo,
                                    soilConductivity: device15.ultimaMedicion.conductividad_suelo,
                                    soilMoisture: device15.ultimaMedicion.agua_suelo,
                                    bandId: device15.ultimaMedicion.banda_id,
                                    modelId: device15.ultimaMedicion.modelo_id,
                                    timestamp: device15.ultimaMedicion.timestamp,
                                    rssi: device15.ultimaMedicion.rssi,
                                    snr: device15.ultimaMedicion.snr,
                                }
                              : null,
                      }
                    : null
            ),
        sensor30: z
            .object({
                info: z
                    .object({
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
                    })
                    .nullable(),
                ultimaMedicion: z.object({
                    id: z.number(),
                    dispositivo_id: z.string(),
                    aplicacion_id: z.string().nullable(),
                    bateria: z.string().transform(Number).pipe(z.number()).nullable(),
                    temperatura_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    conductividad_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    agua_suelo: z.string().transform(Number).pipe(z.number()).nullable(),
                    banda_id: z.string().nullable(),
                    modelo_id: z.string().nullable(),
                    timestamp: z.string().nullable(),
                    rssi: z.number().nullable(),
                    snr: z.string().transform(Number).pipe(z.number()).nullable(),
                }).nullable(),
            })
            .nullable()
            .transform((device30) =>
                device30
                    ? {
                          info: device30.info
                              ? {
                                    id: device30.info.id,
                                    deviceId: device30.info.device_id,
                                    name: device30.info.nombre,
                                    lat: device30.info.lat,
                                    lng: device30.info.long,
                                    topLimit: device30.info.limite_superior,
                                    bottomLimit: device30.info.limite_inferior,
                                    coordinates: device30.info.coordenadas,
                                    idalCapacity: device30.info.capacidadIdeal,
                                    ranchoId: device30.info.rancho_id,
                                }
                              : null,
                          lastMeasurement: device30.ultimaMedicion
                              ? {
                                    id: device30.ultimaMedicion.id,
                                    deviceId: device30.ultimaMedicion.dispositivo_id,
                                    applicationId: device30.ultimaMedicion.aplicacion_id,
                                    battery: device30.ultimaMedicion.bateria,
                                    soilTemperature: device30.ultimaMedicion.temperatura_suelo,
                                    soilConductivity: device30.ultimaMedicion.conductividad_suelo,
                                    soilMoisture: device30.ultimaMedicion.agua_suelo,
                                    bandId: device30.ultimaMedicion.banda_id,
                                    modelId: device30.ultimaMedicion.modelo_id,
                                    timestamp: device30.ultimaMedicion.timestamp,
                                    rssi: device30.ultimaMedicion.rssi,
                                    snr: device30.ultimaMedicion.snr,
                                }
                              : null,
                      }
                    : null
            ),
    })
);
export type ClustersAndSensors = z.infer<typeof GetClustersAndSensorsByRanchId>
export type ClustersAndSensorsByRanchId = z.infer<typeof GetClustersAndSensorsByRanchId>[number];
export type ClusterSensor = z.infer<typeof GetClustersAndSensorsByRanchId>[number]['sensor15'];
