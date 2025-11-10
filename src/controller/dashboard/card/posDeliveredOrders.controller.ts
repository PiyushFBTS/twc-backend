import { Request, Response } from "express";
import { pool } from "../../../db/index";

/**
 * Controller: posDeliveredOrders
 * Description: Fetches data from PostgreSQL function "OOMiddleware".POS_Delivered_Orders()
 */
export const posDeliveredOrders = async (req: Request, res: Response) => {
  try {
    const query = `SELECT col1, col2 FROM "OOMiddleware".POS_Delivered_Orders();`;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/posDeliveredOrders error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
