"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const index_1 = require("../../db/index");
const userSchema_1 = require("../../schema/userSchema"); // we’ll reuse your Zod validation schema
/**
 * Controller: updateUser
 * Description: Updates an existing user's details.
 */
const updateUser = async (req, res) => {
    try {
        if (!index_1.pool) {
            return res.status(500).json({ error: "Database connection not available" });
        }
        // ✅ Parse and validate input using Zod
        const parseResult = userSchema_1.editUserSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error,
            });
        }
        const { role_code, user_code, user_name, first_name, last_name, password } = req.body;
        // ✅ Ensure user_code exists
        if (!user_code) {
            return res.status(400).json({ error: "user_code is required" });
        }
        // ✅ Build dynamic SQL query (if password is being updated)
        let query = `
      UPDATE "OOMiddleware"."users"
      SET role_code = $1,
          user_name = $2,
          first_name = $3,
          last_name = $4
      WHERE user_code = $5
    `;
        const values = [role_code, user_name, first_name, last_name, user_code];
        // 🔹 Optional: If password is present, update it too
        if (password && password.length >= 5) {
            const bcrypt = await Promise.resolve().then(() => __importStar(require("bcryptjs")));
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `
        UPDATE "OOMiddleware"."users"
        SET role_code = $1,
            user_name = $2,
            first_name = $3,
            last_name = $4,
            password = $5
        WHERE user_code = $6
      `;
            values.splice(4, 0, hashedPassword); // insert before user_code
        }
        const result = await index_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};
exports.updateUser = updateUser;
