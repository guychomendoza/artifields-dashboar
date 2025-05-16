import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {getAllUsersSchema} from "./schema";

export const getAllUsers = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/users/users`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return getAllUsersSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}