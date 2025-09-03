import { z } from 'zod'

export const createTodoSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, "title is required").max(200),
        completed: z.boolean().default(false),
        userId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'userId must be a valid ObjectId'),
    })
})

export type CreateTodoBody = z.infer<typeof createTodoSchema>['body']


