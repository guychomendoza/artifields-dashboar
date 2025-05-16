import {BACKEND_URL} from "../api-url";

export const assignAreaToSensor = async (device_id: string, coordinates: google.maps.LatLngLiteral[]) => {
    if (!device_id || !coordinates.length) {
        throw new Error("Missing Data")
    }

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

        if (!response.ok) {
            throw new Error(`Request failed with status code ${  response.status}`);
        }

        return true;
    } catch (error) {
        return false;
    }
}