import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: outletwiseOrders
 * Description: Fetches outlet-wise order counts from PostgreSQL
 * using "OOMiddleware".outletwise_no_of_orders()
 */
export const outletwiseOrders = async (req: Request, res: Response) => {
  try {
    const query = `SELECT col1, col2, col3 FROM "OOMiddleware".outletwise_no_of_orders();`;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/outletwiseOrders error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
