import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
 })

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
 })

export const postInput = z.object({
    title: z.string(),
    content: z.string()
})

export const postUpdate = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
})

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type PostInput = z.infer<typeof postInput>;
export type PostUpdate = z.infer<typeof postUpdate>;