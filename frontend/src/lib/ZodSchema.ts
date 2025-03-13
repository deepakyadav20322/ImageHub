// HERE THESE SCHEMA ARE INFER AND MAKE OUR OWN TYPE FROM IT WHERE WE WANT TO USE IT...
import {z} from 'zod'


// this schema use for login with email/pass 
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});