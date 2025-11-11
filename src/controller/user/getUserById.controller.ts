import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: getUserById
 * Description: Fetch user by user_code from OOMiddleware.users
 */
export const getUserById = async (req: Request, res: Response) => {
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

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      error: "Failed to fetch user",
      details: error.message,
    });
  }
};
