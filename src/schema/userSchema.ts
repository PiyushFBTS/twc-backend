import { z } from "zod";

export const userFormSchema = z.object({
  role_code: z.number().min(1, "Role Code is required"),
  user_name: z.string().min(1, "Username is required"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || val.length >= 5, {
      message: "Password must be at least 5 characters",
    }),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const createUserSchema = userFormSchema.extend({
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const editUserSchema = userFormSchema.extend({
  password: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
