"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posFetchedOrders = void 0;
const index_1 = require("../../../db/index");
/**
 * Controller: posFetchedOrders
 * Description: Fetches fetched orders data from PostgreSQL function
 * "OOMiddleware".POS_Fetched_Orders()
 */
const posFetchedOrders = async (req, res) => {
    try {
        const query = `SELECT col1, col2 FROM "OOMiddleware".POS_Fetched_Orders();`;
        const { rows } = await index_1.pool.query(query);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("GET /dashboard/posFetchedOrders error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.posFetchedOrders = posFetchedOrders;
