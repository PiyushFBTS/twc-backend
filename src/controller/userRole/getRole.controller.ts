import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: getUserRoleList
 * Description: Fetches minimal user role data (role_code, role_name)
 *              from OOMiddleware.user_role table.
 */
export const getUserRoleList = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT role_code, role_name 
      FROM "OOMiddleware".user_role
      ORDER BY role_code ASC;
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error: any) {
    console.error("Error fetching user roles list:", error);
    return res.status(500).json({
      error: "Failed to fetch user roles list",
      details: error.message,
    });
  }
};
