"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: deleteUser
 * Description: Deletes one or multiple users based on user_code array.
 */
const deleteUser = async (req, res) => {
    try {
        const { ids } = req.body;
        // 🧩 Validate input
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No user IDs provided" });
        }
        // 🔎 Step 1: Check if the given IDs exist
        const checkQuery = `
      SELECT user_code FROM "OOMiddleware"."users" 
      WHERE user_code = ANY($1::integer[])
    `;
        const existingUsers = await index_1.pool.query(checkQuery, [ids]);
        if (existingUsers.rows.length === 0) {
            return res.status(404).json({
                message: "No matching users found to delete",
            });
        }
        // 🔹 Step 2: Delete users
        const deleteQuery = `
      DELETE FROM "OOMiddleware"."users"
      WHERE user_code = ANY($1::integer[])
    `;
        await index_1.pool.query(deleteQuery, [ids]);
        return res.status(200).json({
            message: "User(s) deleted successfully",
            deletedCount: existingUsers.rows.length,
            deletedUserCodes: existingUsers.rows.map((u) => u.user_code),
        });
    }
    catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({
            message: "Failed to delete user(s)",
            error: error.message,
        });
    }
};
exports.deleteUser = deleteUser;
