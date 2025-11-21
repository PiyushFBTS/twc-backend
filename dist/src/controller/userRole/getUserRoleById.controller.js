"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleById = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: getUserRoleById
 * Description: Fetch a user role by role_code from OOMiddleware.user_role
 */
const getUserRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        // 🧩 Validate input
        if (!id) {
            return res.status(400).json({ error: "Role ID is required" });
        }
        // 🧠 Query role data
        const query = `
      SELECT * 
      FROM "OOMiddleware".user_role
      WHERE role_code = $1
    `;
        const result = await index_1.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Role not found" });
        }
        // ✅ Return found role
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching role:", error);
        return res.status(500).json({
            error: "Failed to fetch role",
            details: error.message,
        });
    }
};
exports.getUserRoleById = getUserRoleById;
