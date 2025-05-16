import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetAllPhoneConversationSchema, GetAllLatestMessageResponsesSchema} from "./schema";

export const getAllLatestMessageResponses = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/message-history/latest-responses`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllLatestMessageResponsesSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}

export const getAllPhoneConversation = async (phoneNumber: string) => {
    if (!phoneNumber) {
        throw new Error("Phone number is required");
    }
    try {
        const res = await fetch(`${BACKEND_URL}/api/message-history/conversation/${phoneNumber}`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        return GetAllPhoneConversationSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(error);
    }
}