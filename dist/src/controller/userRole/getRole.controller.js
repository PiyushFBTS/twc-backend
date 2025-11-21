"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleList = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: getUserRoleList
 * Description: Fetches minimal user role data (role_code, role_name)
 *              from OOMiddleware.user_role table.
 */
const getUserRoleList = async (req, res) => {
    try {
        const query = `
      SELECT role_code, role_name 
      FROM "OOMiddleware".user_role
      ORDER BY role_code ASC;
    `;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching user roles list:", error);
        return res.status(500).json({
            error: "Failed to fetch user roles list",
            details: error.message,
        });
    }
};
exports.getUserRoleList = getUserRoleList;
