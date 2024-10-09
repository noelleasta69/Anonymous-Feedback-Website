import {z} from "zod"

export const messageSchema = z.object({
    content: z.string()
    .min(1, "message can not be empty")
    .max(300, "max 300 chars")
})