"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserSchema = exports.createUserSchema = exports.userFormSchema = void 0;
const zod_1 = require("zod");
exports.userFormSchema = zod_1.z.object({
    role_code: zod_1.z.number().min(1, "Role Code is required"),
    user_name: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z
        .string()
        .optional()
        .refine((val) => !val || val.length === 0 || val.length >= 5, {
        message: "Password must be at least 5 characters",
    }),
    first_name: zod_1.z.string().min(1, "First name is required"),
    last_name: zod_1.z.string().min(1, "Last name is required"),
});
exports.createUserSchema = exports.userFormSchema.extend({
    password: zod_1.z.string().min(5, "Password must be at least 5 characters"),
});
exports.editUserSchema = exports.userFormSchema.extend({
    password: zod_1.z.string().optional(),
});
