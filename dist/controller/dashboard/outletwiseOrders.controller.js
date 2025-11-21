"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outletwiseOrders = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: outletwiseOrders
 * Description: Fetches outlet-wise order counts from PostgreSQL
 * using "OOMiddleware".outletwise_no_of_orders()
 */
const outletwiseOrders = async (req, res) => {
    try {
        const query = `SELECT col1, col2, col3 FROM "OOMiddleware".outletwise_no_of_orders();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/outletwiseOrders error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.outletwiseOrders = outletwiseOrders;
