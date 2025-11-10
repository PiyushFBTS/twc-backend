import { Request, Response } from "express";
import { pool } from "../../../db/index";

/**
 * Controller: posFetchedOrders
 * Description: Fetches fetched orders data from PostgreSQL function
 * "OOMiddleware".POS_Fetched_Orders()
 */
export const posFetchedOrders = async (req: Request, res: Response) => {
  try {
    const query = `SELECT col1, col2 FROM "OOMiddleware".POS_Fetched_Orders();`;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/posFetchedOrders error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
