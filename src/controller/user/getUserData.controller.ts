import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: getUserData
 * Description: Fetch all users from the OOMiddleware.users table
 */
export const getUserData = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT * 
      FROM "OOMiddleware"."users"
      ORDER BY user_code ASC;
    `;

    const result = await pool.query(query);

    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
};
