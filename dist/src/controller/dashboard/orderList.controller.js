"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderList = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: orderList
 * Description: Fetches complete order list using PostgreSQL function
 * "OOMiddleware".get_order_list_as_json()
 */
const orderList = async (req, res) => {
    try {
        const query = `SELECT "OOMiddleware".get_order_list_as_json();`;
        const { rows } = await index_1.pool.query(query);
        // rows[0] contains the JSON returned by the PostgreSQL function
        const orders = rows || [];
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("GET /dashboard/orderList error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.orderList = orderList;
