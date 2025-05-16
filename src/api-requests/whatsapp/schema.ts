import {z} from "zod";

export const GetAllLatestMessageResponsesSchema = z.object({
    success: z.boolean(),
    data: z.array(
        z.object({
            phone_number: z.string(),
            message: z.string(),
            latest_created_at: z.string(),
        })
    )
}).transform((data) => ({
    success: data.success,
    data: data.data.map((item) => ({
        latestCreatedAt: item.latest_created_at,
        message: item.message,
        phoneNumber: item.phone_number,
    }))
}))

export const GetAllPhoneConversationSchema = z.object({
    success: z.boolean(),
    data: z.array(
        z.object({
            created_at: z.string(),
            message: z.string(),
            response: z.string(),
            user_id: z.number(),
        })
    )
}).transform((data) => ({
    success: data.success,
    data: data.data.map((item) => ({
        createdAt: item.created_at,
        message: item.message,
        response: item.response,
        userId: item.user_id,
    }))
}))