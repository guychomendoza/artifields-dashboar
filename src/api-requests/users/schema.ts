import {z} from "zod";

export const getAllUsersSchema = z.array(
    z.object({
        id: z.number(),
        nombre: z.string().nullable(),
        correo: z.string(),
        contraseña: z.string(),
        tipo_usuario: z.number().min(1).max(3),
        pago_realizado: z.boolean(),
        fecha_creacion: z.string().datetime(),
        ultima_actualizacion: z.string().datetime(),
        foto_perfil: z.string().nullable(),
        fecha_ultimo_pago: z.string().datetime().nullable(),
        reset_password_token: z.string().nullable(),
        reset_password_expires: z.string().datetime().nullable(),
        telefono: z.string().nullable(),
        chatbot_whats: z.boolean(),
        ultima_sesion: z.string().datetime(),
        lat: z.string().transform(Number).pipe(z.number()).nullable(),
        longitude: z.string().transform(Number).pipe(z.number()).nullable(),
        region: z.string().nullable()
    })
).transform((data) => data.map((user) => ({
    id: user.id,
    name: user.nombre,
    email: user.correo,
    password: user.contraseña,
    userType: user.tipo_usuario,
    paymentMade: user.pago_realizado,
    createdAt: user.fecha_creacion,
    updatedAt: user.ultima_actualizacion,
    profilePicture: user.foto_perfil,
    lastPaymentDate: user.fecha_ultimo_pago,
    resetPasswordToken: user.reset_password_token,
    resetPasswordExpires: user.reset_password_expires,
    phone: user.telefono,
    whatsappChatbot: user.chatbot_whats,
    lastSession: user.ultima_sesion,
    latitude: user.lat,
    longitude: user.longitude,
    region: user.region
})));