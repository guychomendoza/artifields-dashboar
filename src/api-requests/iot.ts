import { BACKEND_URL } from "./api-url";

import type { Sensor, DeviceRead, UserSensor, SensorInfo, DeviceGroup, AssignedSensor,  UnassignedSensor, LastSensorMeasurement } from "./type";

export const fetchIotDevices = async (): Promise<DeviceRead[]> => {

    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/read`);
        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data: DeviceRead[] = await response.json();
        return data;
    } catch (error) {
        return [];
    }

}

export const fetchUniqueGroups = async (): Promise<DeviceGroup[]> => {
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/grupos-unicos`);
        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data: DeviceGroup[] = await response.json();
        return data;
    } catch (error) {
        return [];
    }
    
}

export const moveDeviceToGroup = async (device_id: string, grupo_id: number | null, grupo_name: string | null): Promise<boolean> => {

    if (!device_id) return false;
        
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/sensores1/${device_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grupo_id,
                grupo_name,
            }),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

export const fetchSensorsById = async (device_id: string): Promise<Sensor[]> => {

    if (!device_id) return [];
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/sensores-por-ids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dispositivos: [device_id],
            }),
        });

        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data[device_id] as Sensor[];
    } catch (error) {
        return [];
    }
}

export const fetchLastMeasurementById = async (device_id: string): Promise<LastSensorMeasurement | null> => {
    
    if (!device_id) return null;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/ultimaMedicion/${device_id}`)

        if (!response.ok) {
            return null;
        }

        if (response.status !== 200) {
            return null;
        }

        const data = await response.json();
        return data as LastSensorMeasurement;
    } catch (error) {
        return null;
    }
}

export const fetchUnassignedSensors = async (): Promise<UnassignedSensor[]> => {
        
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensor-assignments/unassigned-sensors`);
        if (!response.ok) {
            return [];
        }

        if (response.status !== 200) {
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
}

export const fetchAssignedSensors = async (): Promise<AssignedSensor[]> => {
            
        try {
            const response = await fetch(`${BACKEND_URL}/api/sensor-assignments/user-sensor-names-ids`);
            if (!response.ok) {
                return [];
            }
    
            if (response.status !== 200) {
                return [];
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            return [];
        }
    }

export const assignSensorToUser = async (device_id: string, user_id: number): Promise<boolean> => {

    if (!device_id || !user_id) return false;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensor-assignments/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id,
                user_id,
            }),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

export const unassignSensorFromUser = async (device_id: string, user_id: number): Promise<boolean> => {
    
        if (!device_id || !user_id) return false;
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/sensor-assignments/user/${user_id}/sensor/${device_id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                return false;
            }
    
            return true;
        } catch (error) {
            return false;
        }
    }

export const fetchUserSensors = async (user_id: number): Promise<UserSensor[]> => {
        
        if (!user_id) return [];
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/sensor-assignments/user/${user_id}/sensors`);
            if (!response.ok) {
                return [];
            }
    
            if (response.status !== 200) {
                return [];
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            return [];
        }
}

export const updateCoordinates = async (device_id: string, lat: number, lon: number): Promise<boolean> => {
        
    if (!device_id) return false;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/sensors/${device_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat,
                long: lon,
            }),
        });

        if (!response.ok) {
            return false;
        }

        if (response.status !== 200) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

export const getSensorInfo = async (device_id: string): Promise<SensorInfo | null> => {

    if (!device_id) return null;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/${device_id}`);
        if (!response.ok) {
            return null;
        }

        if (response.status !== 200) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }

}

export const changeSensorNickname = async (device_id: string, nickname: string): Promise<boolean> => {
    if (!device_id || !nickname) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/asignar-nombre`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nickname,
                device_id,
            }),
        });

        return response.ok;


    } catch (error) {
        return false;
    }
}

export const changeSensorCapacity = async (device_id: string, capacity: number) => {
    if (!device_id || !capacity) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/${device_id}/capacidad-ideal`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "capacidadIdeal": capacity,
            })
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}

export const assignSensorRanchArea = async (device_id: string, coordinates: google.maps.LatLngLiteral[]) => {
    if (!device_id || !coordinates.length) return false;

    try {
        const response = await fetch(`${BACKEND_URL}/api/sensors/sensores/${device_id}/coordenadas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "coordenadas": coordinates,
            })
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}