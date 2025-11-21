"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noOfOrders = void 0;
const index_1 = require("../../../db/index");
/**
 * Controller: noOfOrders
 * Description: Fetches order statistics from the database
 * using the PostgreSQL function: "OOMiddleware".No_of_Orders()
 */
const noOfOrders = async (req, res) => {
    try {
        const query = `SELECT col1, col2 FROM "OOMiddleware".No_of_Orders();`;
        const { rows } = await index_1.pool.query(query);
        // Return JSON response
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/noOfOrders error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.noOfOrders = noOfOrders;
