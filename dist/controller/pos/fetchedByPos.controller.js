"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedByPos = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: fetchedByPos
 * Description: Marks orders as fetched by POS in the database.
 */
const fetchedByPos = async (req, res) => {
    try {
        const { order_id } = req.body;
        if (!index_1.pool) {
            return res.status(500).json({ error: "Database connection not available" });
        }
        // Validate input
        if (!Array.isArray(order_id) || order_id.length === 0) {
            return res.status(400).json({ message: "No order IDs provided" });
        }
        // 🔹 Step 1: Check if orders exist
        const existingQuery = `
      SELECT order_id 
      FROM "OOMiddleware".order_header
      WHERE order_id = ANY($1::bigint[])
    `;
        const existingResult = await index_1.pool.query(existingQuery, [order_id]);
        const existingIds = existingResult.rows.map((r) => r.order_id);
        const notFoundIds = order_id.filter((id) => !existingIds.includes(id));
        if (notFoundIds.length > 0) {
            return res.status(404).json({
                error: "Some order IDs were not found",
                notFoundOrders: notFoundIds,
            });
        }
        // 🔹 Step 2: Check if already fetched
        const alreadyFetchedQuery = `
      SELECT order_id 
      FROM "OOMiddleware".order_header
      WHERE order_id = ANY($1::bigint[])
      AND fetched_by_pos = 'Y'
    `;
        const alreadyFetchedResult = await index_1.pool.query(alreadyFetchedQuery, [order_id]);
        if (alreadyFetchedResult.rows.length > 0) {
            return res.status(400).json({
                error: "Some orders are already fetched at POS",
                alreadyFetchedOrders: alreadyFetchedResult.rows.map((r) => r.order_id),
            });
        }
        // 🔹 Step 3: Update orders as fetched
        const currentTime = new Date();
        const fetched = "Y";
        const updateQuery = `
      UPDATE "OOMiddleware".order_header
      SET fetched_by_pos = $1,
          "fetched_by_pos_Time" = $2
      WHERE order_id = ANY($3::bigint[])
    `;
        const values = [fetched, currentTime, order_id];
        await index_1.pool.query(updateQuery, values);
        return res.status(200).json({
            message: "Fetched at POS successfully",
            updatedOrders: order_id,
        });
    }
    catch (error) {
        console.error("Error in fetchedByPos:", error);
        return res.status(500).json({
            error: "Failed to mark orders as fetched at POS",
            details: String(error),
        });
    }
};
exports.fetchedByPos = fetchedByPos;
