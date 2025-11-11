import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: getUserRoleById
 * Description: Fetch a user role by role_code from OOMiddleware.user_role
 */
export const getUserRoleById = async (req: Request, res: Response) => {
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

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    // ✅ Return found role
    return res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching role:", error);
    return res.status(500).json({
      error: "Failed to fetch role",
      details: error.message,
    });
  }
};
