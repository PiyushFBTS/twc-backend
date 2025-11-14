import { Request, Response } from "express";
import { pool } from "../../db/index";

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Order ID is required",
      });
    }

    // 🔥 Call your stored function
    const result = await pool.query(
      `SELECT "OOMiddleware".get_order_by_id_as_json($1) AS data`,
      [id]
    );

    const row = result.rows[0]?.data;

    if (!row) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.status(200).json(row);

  } catch (error: any) {
    console.error("Order Fetch Error:", error);

    return res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
      status: "fail",
      timestamp: new Date().toLocaleString("en-IN"),
    });
  }
};
