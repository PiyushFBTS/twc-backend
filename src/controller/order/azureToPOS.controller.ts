import { Request, Response } from "express";
import { pool } from "../../db/index";

/**
 * Controller: azureToPOS
 * Description: Fetches orders for a given store (merchantRefId)
 * by calling the Postgres function: "OOMiddleware".get_orders_f($1)
 */
export const azureToPOS = async (req: Request, res: Response) => {
  try {
    const { storeid: merchantRefId } = req.body;

    if (!merchantRefId) {
      return res.status(400).json({ error: "storeid (merchantRefId) is required" });
    }

    // Safe parameterized query
    const headerQuery = `SELECT "OOMiddleware".get_orders_f($1) AS orders`;
    const { rows } = await pool.query(headerQuery, [merchantRefId]);

    // Extract JSONB result
    const orders = rows?.[0]?.orders || { Order: [] };

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error("POST /api/orders/azureToPOS error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
