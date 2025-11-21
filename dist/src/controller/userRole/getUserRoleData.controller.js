"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleData = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: getUserRoleData
 * Description: Fetch all user roles from OOMiddleware.user_role table
 */
const getUserRoleData = async (req, res) => {
    try {
        const query = `
      SELECT * 
      FROM "OOMiddleware".user_role
      ORDER BY role_code ASC;
    `;
        const result = await index_1.pool.query(query);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching UserRole:", error);
        return res.status(500).json({
            error: "Failed to fetch user roles",
            details: error.message,
        });
    }
};
exports.getUserRoleData = getUserRoleData;
