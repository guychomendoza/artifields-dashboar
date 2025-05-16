import type { Sensor, LastSensorMeasurement } from 'src/api-requests/type'

import { create } from 'zustand'

interface SensorState {
    // allSensors: Sensor[]
    // setAllSensors: (sensors: Sensor[]) => void
    // selectedSensor: Sensor | null
    // setSelectedSensor: (sensor: Sensor) => void
    allMeasurements: Sensor[]
    setAllMeasurements: (measurements: Sensor[]) => void
    selectedMeasurement: LastSensorMeasurement | null
    setSelectedMeasurement: (measurement: LastSensorMeasurement) => void
}

export const useSensor = create<SensorState>((set) => ({
    // allSensors: [],
    // setAllSensors: (sensors) => set(() => ({ allSensors: sensors })),
    // selectedSensor: null,
    // setSelectedSensor: (sensor) => set(() => ({ selectedSensor: sensor })),
    allMeasurements: [],
    setAllMeasurements: (measurements) => set(() => ({ allMeasurements: measurements })),
    selectedMeasurement: null,
    setSelectedMeasurement: (measurement) => set(() => ({ selectedMeasurement: measurement })),
}))