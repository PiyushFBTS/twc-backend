"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: getUserById
 * Description: Fetch user by user_code from OOMiddleware.users
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // 🧩 Validate param
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const query = `
      SELECT * 
      FROM "OOMiddleware"."users"
      WHERE user_code = $1
    `;
        const result = await index_1.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            error: "Failed to fetch user",
            details: error.message,
        });
    }
};
exports.getUserById = getUserById;
