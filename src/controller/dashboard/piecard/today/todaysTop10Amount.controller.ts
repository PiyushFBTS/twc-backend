import { Request, Response } from "express";
import { pool } from "../../../../db/index";

/**
 * Controller: todaysTop10Amount
 * Description: Fetches today's top 10 items by total amount
 * using PostgreSQL function "OOMiddleware".Todays_top_10_amt()
 */
export const todaysTop10Amount = async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM "OOMiddleware".Todays_top_10_amt();`;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/pie-chart/today/todaysTop10Amount error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
