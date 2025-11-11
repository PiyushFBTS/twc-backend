import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: getUserRoleData
 * Description: Fetch all user roles from OOMiddleware.user_role table
 */
export const getUserRoleData = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT * 
      FROM "OOMiddleware".user_role
      ORDER BY role_code ASC;
    `;

    const result = await pool.query(query);

    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching UserRole:", error);
    return res.status(500).json({
      error: "Failed to fetch user roles",
      details: error.message,
    });
  }
};
