import { Request, Response } from "express";
import { pool } from "../../../../db/index";

/**
 * Controller: thisMonthTodaysTop10Amount
 * Description: Fetches today's top 10 order amounts for this month
 * using PostgreSQL function "OOMiddleware".Todays_top_10_amt_TM()
 */
export const thisMonthTodaysTop10Amount = async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM "OOMiddleware".Todays_top_10_amt_TM();`;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET /dashboard/pie-chart/monthly/thisMonthTodaysTop10Amount error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
