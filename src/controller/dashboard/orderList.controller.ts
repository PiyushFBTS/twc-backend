import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: orderList
 * Description: Fetches complete order list using PostgreSQL function
 * "OOMiddleware".get_order_list_as_json()
 */
export const orderList = async (req: Request, res: Response) => {
  try {
    const query = `SELECT "OOMiddleware".get_order_list_as_json();`;
    const { rows } = await pool.query(query);

    // rows[0] contains the JSON returned by the PostgreSQL function
    const orders = rows?.[0]?.get_order_list_as_json || [];

    return res.status(200).json(orders);
  } catch (error) {
    console.error("GET /dashboard/orderList error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
