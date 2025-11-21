"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../../db/index");
const userSchema_1 = require("../../schema/userSchema");
/**
 * Controller: createUser
 * Description: Creates a new user record in the OOMiddleware.users table
 */
const createUser = async (req, res) => {
    try {
        // ✅ Validate request body using Zod
        const parseResult = userSchema_1.createUserSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error,
            });
        }
        const { role_code, user_name, password, first_name, last_name } = parseResult.data;
        // ✅ Check if user already exists
        const checkQuery = `
      SELECT user_name FROM "OOMiddleware"."users" WHERE user_name = $1
    `;
        const existingUser = await index_1.pool.query(checkQuery, [user_name]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Username already exists",
                status: "fail",
            });
        }
        // ✅ Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // ✅ Default audit fields
        const currentUser = req.user?.user_name || "system";
        const currentTime = new Date();
        // ✅ SQL insert query
        const insertQuery = `
      INSERT INTO "OOMiddleware"."users" (
        role_code, user_name, password, first_name, last_name, created_by_user, created_on_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING user_code;
    `;
        const values = [
            role_code,
            user_name,
            hashedPassword,
            first_name,
            last_name,
            currentUser,
            currentTime,
        ];
        const result = await index_1.pool.query(insertQuery, values);
        return res.status(201).json({
            user_code: result.rows[0].user_code,
            message: "User created successfully",
            status: "success",
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            message: "Failed to create user",
            error: error.message,
            status: "fail",
        });
    }
};
exports.createUser = createUser;
