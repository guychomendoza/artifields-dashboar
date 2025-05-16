interface SensorProps {
    limite_inferior: number | null;
    limite_superior: number | null;
    capacidadIdeal: string | null;
    agua_suelo: string | null;
}

type RGB = {
    r: number;
    g: number;
    b: number;
};

export const getColor = (props: SensorProps): string => {
    const {
        limite_inferior,
        limite_superior,
        capacidadIdeal,
        agua_suelo
    } = props;

    // Convert agua_suelo from string to number if it exists
    const currentValue = agua_suelo ? parseFloat(agua_suelo) : null;
    if (currentValue === null) return '#808080'; // Return gray if no value

    // Set default limits if not provided
    const bottomLimit = limite_inferior !== null ? limite_inferior : 10;
    const topLimit = limite_superior !== null ? limite_superior : 50;
    const idealCapacity = capacidadIdeal ? parseFloat(capacidadIdeal) : null;

    // Helper function to get color interpolation value between 0 and 1
    const getInterpolationValue = (value: number, min: number, max: number): number => Math.max(0, Math.min(1, (value - min) / (max - min)));

    // Helper function to interpolate between two colors
    const interpolateColor = (color1: string, color2: string, factor: number): string => {
        // Convert hex to RGB
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        // Interpolate
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        // Convert back to hex
        // eslint-disable-next-line no-bitwise
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };

    // Constants for colors
    const RED = '#f10b0b';
    const GREEN = '#00ff00';
    const BLUE = '#0b2af1';
    const YELLOW = '#ffff00';

    // If we have an ideal capacity, use it as reference
    if (idealCapacity !== null) {
        if (currentValue === idealCapacity) return GREEN;

        // Above ideal capacity
        if (currentValue > idealCapacity) {
            const factor = getInterpolationValue(currentValue, idealCapacity, topLimit);
            return interpolateColor(GREEN, BLUE, factor);
        }

        // Below ideal capacity
        const factor = getInterpolationValue(currentValue, bottomLimit, idealCapacity);
        return interpolateColor(RED, GREEN, factor);
    }

    // No ideal capacity - use yellow for middle range
    const range = topLimit - bottomLimit;
    const middlePoint = bottomLimit + (range / 2);
    const tolerance = range * 0.2; // 20% tolerance for yellow zone

    if (currentValue >= (middlePoint - tolerance) &&
        currentValue <= (middlePoint + tolerance)) {
        return YELLOW;
    }

    if (currentValue > middlePoint) {
        const factor = getInterpolationValue(currentValue, middlePoint + tolerance, topLimit);
        return interpolateColor(YELLOW, BLUE, factor);
    }

    const factor = getInterpolationValue(currentValue, bottomLimit, middlePoint - tolerance);
    return interpolateColor(RED, YELLOW, factor);
};

export const getSensorColor = (props: {
    bottomLimit: number | null,
    topLimit: number | null,
    idealCapacity: number | null,
    soilMoisture: number | null
}): string => {
    const {
        bottomLimit,
        topLimit,
        idealCapacity,
        soilMoisture
    } = props;

    // Convert soilMoisture from string to number if it exists
    const currentValue = soilMoisture;
    if (currentValue === null) return '#808080'; // Return gray if no value

    // Set default limits if not provided
    const effectiveBottomLimit = bottomLimit !== null ? bottomLimit : 10;
    const effectiveTopLimit = topLimit !== null ? topLimit : 50;
    const effectiveIdealCapacity = idealCapacity;

    // Helper function to get color interpolation value between 0 and 1
    const getInterpolationValue = (value: number, min: number, max: number): number => Math.max(0, Math.min(1, (value - min) / (max - min)));

    // Helper function to interpolate between two colors
    const interpolateColor = (color1: string, color2: string, factor: number): string => {
        // Convert hex to RGB
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        // Interpolate
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        // Convert back to hex
        // eslint-disable-next-line no-bitwise
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };

    // Constants for colors
    const RED = '#f10b0b';
    const GREEN = '#00ff00';
    const BLUE = '#0b2af1';
    const YELLOW = '#ffff00';

    // If we have an ideal capacity, use it as reference
    if (effectiveIdealCapacity !== null) {
        if (currentValue === effectiveIdealCapacity) return GREEN;

        // Above ideal capacity
        if (currentValue > effectiveIdealCapacity) {
            const factor = getInterpolationValue(currentValue, effectiveIdealCapacity, effectiveTopLimit);
            return interpolateColor(GREEN, BLUE, factor);
        }

        // Below ideal capacity
        const factor = getInterpolationValue(currentValue, effectiveBottomLimit, effectiveIdealCapacity);
        return interpolateColor(RED, GREEN, factor);
    }

    // No ideal capacity - use yellow for middle range
    const range = effectiveTopLimit - effectiveBottomLimit;
    const middlePoint = effectiveBottomLimit + (range / 2);
    const tolerance = range * 0.2; // 20% tolerance for yellow zone

    if (currentValue >= (middlePoint - tolerance) &&
        currentValue <= (middlePoint + tolerance)) {
        return YELLOW;
    }

    if (currentValue > middlePoint) {
        const factor = getInterpolationValue(currentValue, middlePoint + tolerance, effectiveTopLimit);
        return interpolateColor(YELLOW, BLUE, factor);
    }

    const factor = getInterpolationValue(currentValue, effectiveBottomLimit, middlePoint - tolerance);
    return interpolateColor(RED, YELLOW, factor);
};