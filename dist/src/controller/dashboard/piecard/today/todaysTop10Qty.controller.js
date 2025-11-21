"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todaysTop10Qty = void 0;
const index_1 = require("../../../../db/index");
/**
 * Controller: todaysTop10Qty
 * Description: Fetches today's top 10 items by quantity
 * using PostgreSQL function "OOMiddleware".Todays_top_10_qty()
 */
const todaysTop10Qty = async (req, res) => {
    try {
        const query = `SELECT * FROM "OOMiddleware".Todays_top_10_qty();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/pie-chart/today/todaysTop10Qty error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.todaysTop10Qty = todaysTop10Qty;
