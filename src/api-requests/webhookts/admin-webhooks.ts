import {z} from "zod";

import {BACKEND_URL} from "../api-url";
import {GetFilteredWebhooksSchema} from "./schema";

type getFilteredWebhooksProps = {
    modelFilter: string;
    serverFilter: string;
    urlFilter: string;
}

export const getFilteredWebhooks = async ({
    modelFilter,
    serverFilter,
    urlFilter,
}: getFilteredWebhooksProps) => {
    try {
        const params = new URLSearchParams();

        if (modelFilter) {
            params.append("modelo", modelFilter);
        }

        if (serverFilter) {
            params.append("networkserver", serverFilter);
        }

        if (urlFilter) {
            params.append("url", urlFilter);
        }

        const res = await fetch(`${BACKEND_URL}/api/webhooks?${params.toString()}`);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Webhooks obtenidos exitosamente") {
            throw new Error("Ha ocurrido un error al obtener los webhooks")
        }

        return GetFilteredWebhooksSchema.parse(json);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            throw new Error(error.message);
        }
        throw new Error(`Failed to get webhooks: ${error}`);
    }
}

export const createWebhook = async (
    model: string,
    url: string,
    networkserver: string
) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/webhooks`, {
            method: 'POST',
            body: JSON.stringify({
                "modelo": model,
                "url": url,
                "networkserver": networkserver
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Webhook creado exitosamente") {
            throw new Error("Ha ocurrido un error al crear el webhook")
        }
    } catch (e) {
        throw new Error(`Failed to create webhook: ${e}`);
    }
}

export const deleteWebhook = async (
    webhookId: number,
) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/webhooks/${webhookId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Webhook eliminado exitosamente") {
            throw new Error("Ha ocurrido un error al eliminar el webhook")
        }
    } catch (e) {
        throw new Error(`Failed to delete webhook: ${e}`);
    }
}

export const editWebhook = async (
    webhookId: number,
    webhookModel: string,
    webhookUrl: string,
    webhookNetworkServer: string,
) => {
    if (!webhookId || !webhookUrl || !webhookNetworkServer || !webhookModel) {
        throw new Error("Missing data")
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/webhooks/${webhookId}`, {
            method: 'PUT',
            body: JSON.stringify({
                "modelo": webhookModel,
                "url": webhookUrl,
                "networkserver": webhookNetworkServer
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await res.json();

        if (json.message !== "Webhook actualizado exitosamente") {
            throw new Error("Ha ocurrido un error al editar el webhook")
        }
    } catch (e) {
        throw new Error(`Failed update webhook: ${e}`);
    }
}