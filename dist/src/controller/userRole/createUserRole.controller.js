"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRole = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: createUserRole
 * Description: Adds a new role to the user_role table.
 */
const createUserRole = async (req, res) => {
    try {
        const { role_code, role_name, role_description, created_by, modified_by } = req.body;
        // ✅ Validate required fields
        if (!role_code || !role_name) {
            return res.status(400).json({
                message: "role_code and role_name are required",
                status: "fail",
            });
        }
        const currentUser = created_by || "system";
        const currentTime = new Date();
        // ✅ SQL Query
        const query = `
      INSERT INTO "OOMiddleware".user_role (
        role_code, role_name, role_description, created_by, created_on, modified_by, modified_on
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING role_code;
    `;
        const values = [
            role_code,
            role_name,
            role_description || null,
            currentUser,
            currentTime,
            modified_by || currentUser,
            currentTime,
        ];
        const result = await index_1.pool.query(query, values);
        return res.status(201).json({
            role_code: result.rows[0].role_code,
            message: "User role created successfully",
            status: "success",
        });
    }
    catch (error) {
        console.error("Error creating user role:", error);
        return res.status(500).json({
            message: "Failed to create user role",
            error: error.message,
            status: "fail",
        });
    }
};
exports.createUserRole = createUserRole;
