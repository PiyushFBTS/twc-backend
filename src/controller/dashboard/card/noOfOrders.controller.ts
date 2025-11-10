import { Request, Response } from "express";
import { pool } from "../../../db/index";

/**
 * Controller: noOfOrders
 * Description: Fetches order statistics from the database
 * using the PostgreSQL function: "OOMiddleware".No_of_Orders()
 */
export const noOfOrders = async (req: Request, res: Response) => {
  try {
    const query = `SELECT col1, col2 FROM "OOMiddleware".No_of_Orders();`;
    const { rows } = await pool.query(query);

    // Return JSON response
    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/noOfOrders error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
