import { es } from "date-fns/locale";
import { parseISO, formatDistance } from "date-fns";

export const formatTimestamp = (isoTimestamp: string | null | undefined) => {
    // Return a default message if timestamp is missing
    if (!isoTimestamp) {
        return 'Fecha no disponible';
    }

    try {
        // Parse the ISO string to a Date object
        const date = parseISO(isoTimestamp);

        // Validate that we got a valid date using Number
        if (!Number(date)) {
            return 'Fecha inválida';
        }

        // Get current time
        const now = new Date();

        return formatDistance(date, now, {
            addSuffix: true,
            locale: es,
        });
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return 'Error en fecha';
    }
};