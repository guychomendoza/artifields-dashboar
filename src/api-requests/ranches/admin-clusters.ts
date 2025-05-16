import { z } from 'zod';

import { BACKEND_URL } from '../api-url';
import { GetClustersAndSensorsByRanchId } from './schema';

export const createNewCluster = async (data: {
    name: string;
    lat: number;
    long: number;
    coordinatesArea: google.maps.LatLngLiteral[];
    type: string;
    color: string;
    sensor15ID?: number | null;
    sensor30ID?: number | null;
    ranchoId: number;
}) => {
    try {
        const body: {
            rancho_id: number;
            nombre: string;
            lat: number;
            lng: number;
            area: {
                tipo: string;
                coords: google.maps.LatLngLiteral[];
            };
            tipo: string;
            color: string;
            sensor_15_id?: number; // Optional properties
            sensor_30_id?: number;
        } = {
            rancho_id: data.ranchoId,
            nombre: data.name,
            lat: data.lat,
            lng: data.long,
            area: {
                tipo: 'poligono',
                coords: data.coordinatesArea,
            },
            tipo: data.type,
            color: data.color,
        };

        // Assign only if they exist (avoids ESLint warning)
        if (data.sensor15ID) body.sensor_15_id = data.sensor15ID;
        if (data.sensor30ID) body.sensor_30_id = data.sensor30ID;

        const res = await fetch(`${BACKEND_URL}/api/clusters`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        if (res.status !== 201) {
            throw new Error('Your cluster could not be created.');
        }
    } catch (e) {
        throw new Error(`Failed to create sensor: ${e}`);
    }
};

export const getClustersAndSensorsByRanchId = async (ranchId: number) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/clusters/por-rancho/${ranchId}`);
        const json = await res.json();

        if (res.status === 404 && json?.message === 'No se encontraron clusters para este rancho') {
            return [];
        }

        if (!res.ok) {
            throw Error('Network response was not ok');
        }

        return GetClustersAndSensorsByRanchId.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw Error(error.message);
        }
        throw Error(error);
    }
};

export const editCluster = async (data: {
    name: string;
    lat: number;
    long: number;
    coordinatesArea: google.maps.LatLngLiteral[];
    type: string;
    color: string;
    sensor15ID: number | null;
    sensor30ID: number | null;
    ranchoId: number;
    clusterId: number;
}) => {
    try {
        const body: {
            rancho_id: number;
            nombre: string;
            lat: number;
            lng: number;
            area: {
                tipo: string;
                coords: google.maps.LatLngLiteral[];
            };
            tipo: string;
            color: string;
            sensor_15_id: number | null;
            sensor_30_id: number | null;
        } = {
            rancho_id: data.ranchoId,
            nombre: data.name,
            lat: data.lat,
            lng: data.long,
            area: {
                tipo: 'poligono',
                coords: data.coordinatesArea,
            },
            tipo: data.type,
            color: data.color,
            sensor_15_id: data.sensor15ID,
            sensor_30_id: data.sensor30ID,
        };

        const res = await fetch(`${BACKEND_URL}/api/clusters/${data.clusterId}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        if (res.status !== 200) {
            throw new Error('Your cluster could not be edited.');
        }
    } catch (e) {
        throw new Error(`Failed to create sensor: ${e}`);
    }
};

export const deleteCluster = async (clusterId: number) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/clusters/${clusterId}`, {
            method: 'DELETE',
        });

        if (res.status !== 200) {
            throw new Error('Network response was not ok');
        }
    } catch (e) {
        throw new Error(`Failed to delete cluster: ${e}`);
    }
}
