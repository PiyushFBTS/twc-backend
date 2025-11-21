"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posDeliveredOrders = void 0;
const index_1 = require("../../../db/index");
/**
 * Controller: posDeliveredOrders
 * Description: Fetches data from PostgreSQL function "OOMiddleware".POS_Delivered_Orders()
 */
const posDeliveredOrders = async (req, res) => {
    try {
        const query = `SELECT col1, col2 FROM "OOMiddleware".POS_Delivered_Orders();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/posDeliveredOrders error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.posDeliveredOrders = posDeliveredOrders;
