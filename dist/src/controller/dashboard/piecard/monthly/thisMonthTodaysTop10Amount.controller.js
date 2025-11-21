"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thisMonthTodaysTop10Amount = void 0;
const index_1 = require("../../../../db/index");
/**
 * Controller: thisMonthTodaysTop10Amount
 * Description: Fetches today's top 10 order amounts for this month
 * using PostgreSQL function "OOMiddleware".Todays_top_10_amt_TM()
 */
const thisMonthTodaysTop10Amount = async (req, res) => {
    try {
        const query = `SELECT * FROM "OOMiddleware".Todays_top_10_amt_TM();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/pie-chart/monthly/thisMonthTodaysTop10Amount error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.thisMonthTodaysTop10Amount = thisMonthTodaysTop10Amount;
