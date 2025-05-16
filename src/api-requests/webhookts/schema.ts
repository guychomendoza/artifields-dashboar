import {z} from "zod";

export const GetFilteredWebhooksSchema = z.object({
    message: z.string(),
    data: z.array(
        z.object({
            id: z.number(),
            modelo: z.string(),
            networkserver: z.string(),
            url: z.string(),
        })
    ),
}).transform((webhook) => ({
    message: webhook.message,
    data: webhook.data.map((item) => ({
        id: item.id,
        model: item.modelo,
        networkServer: item.networkserver,
        url: item.url,
    }))
}))

export type WebhookData = z.infer<typeof GetFilteredWebhooksSchema>["data"][number];