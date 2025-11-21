"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: getUserData
 * Description: Fetch all users from the OOMiddleware.users table
 */
const getUserData = async (req, res) => {
    try {
        const query = `
      SELECT * 
      FROM "OOMiddleware"."users"
      ORDER BY user_code ASC;
    `;
        const result = await index_1.pool.query(query);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            error: "Failed to fetch users",
            details: error.message,
        });
    }
};
exports.getUserData = getUserData;
