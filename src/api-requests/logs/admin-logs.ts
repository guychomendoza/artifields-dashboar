import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetSensorLogsSchema} from "./schema";

type getSensorLogsProps = {
    page: number;
    limit?: number;
    titleFilter?: string;
    jsonFilter?: string;
}

export const getSensorLogs = async ({
    page = 1,
    limit = 10,
    titleFilter = "",
    jsonFilter = "",
}: getSensorLogsProps) => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (titleFilter) {
            params.append("title", titleFilter);
        }

        if (jsonFilter) {
            params.append("json", jsonFilter);
        }

        const url = `${BACKEND_URL}/api/errors/sensors?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const json = await res.json();
        return GetSensorLogsSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error as string);
    }
};