"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todaysTop10Amount = void 0;
const index_1 = require("../../../../db/index");
/**
 * Controller: todaysTop10Amount
 * Description: Fetches today's top 10 items by total amount
 * using PostgreSQL function "OOMiddleware".Todays_top_10_amt()
 */
const todaysTop10Amount = async (req, res) => {
    try {
        const query = `SELECT * FROM "OOMiddleware".Todays_top_10_amt();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/pie-chart/today/todaysTop10Amount error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.todaysTop10Amount = todaysTop10Amount;
