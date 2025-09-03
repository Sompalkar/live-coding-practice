import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

// Minimal reusable Zod validation middleware
export default function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        if (!result.success) {
            const issues = result.error.issues.map((i) => ({
                path: i.path.join('.'),
                message: i.message,
                code: i.code,
            }))
            return res.status(400).json({ message: 'Validation failed', issues })
        }

        // Replace with parsed values (trimmed, coerced, etc.)
        const data = result.data as { body: any; query: any; params: any }
        req.body = data.body
        // Do not reassign req.query/req.params (getter-only in Express 5 router)
        // Controllers can use req.query/req.params as-is or we can expose parsed values:
        // res.locals.validated = data
        ;
        return next()
    }
}


