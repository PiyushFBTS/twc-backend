"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processedAtPos = void 0;
const index_1 = require("../../db/index");
/**
 * Controller: processedAtPos
 * Description: Marks orders as processed at POS after verifying existence, fetch status, and duplicate processing.
 */
const processedAtPos = async (req, res) => {
    try {
        const { order_id } = req.body;
        // 🧱 Validate DB connection
        if (!index_1.pool) {
            return res.status(500).json({ error: "Database connection not available" });
        }
        // 🧾 Validate request body
        if (!Array.isArray(order_id) || order_id.length === 0) {
            return res.status(400).json({ message: "No order IDs provided" });
        }
        // 🔍 Step 1: Check if all IDs exist
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
        // 🔎 Step 2: Check if all are fetched
        const notFetchedQuery = `
      SELECT order_id 
      FROM "OOMiddleware".order_header
      WHERE order_id = ANY($1::bigint[])
      AND (fetched_by_pos IS DISTINCT FROM 'Y')
    `;
        const notFetchedResult = await index_1.pool.query(notFetchedQuery, [order_id]);
        if (notFetchedResult.rows.length > 0) {
            return res.status(400).json({
                error: "Some orders have not been fetched yet. Please fetch before processing.",
                notFetchedOrders: notFetchedResult.rows.map((r) => r.order_id),
            });
        }
        // 🔎 Step 3: Check if already processed
        const alreadyProcessedQuery = `
      SELECT order_id 
      FROM "OOMiddleware".order_header
      WHERE order_id = ANY($1::bigint[])
      AND processed_at_pos = 'Y'
    `;
        const alreadyProcessedResult = await index_1.pool.query(alreadyProcessedQuery, [order_id]);
        if (alreadyProcessedResult.rows.length > 0) {
            return res.status(400).json({
                error: "Some orders are already processed at POS",
                alreadyProcessedOrders: alreadyProcessedResult.rows.map((r) => r.order_id),
            });
        }
        // ✅ Step 4: Update since all checks passed
        const currentTime = new Date();
        const processed = "Y";
        const updateQuery = `
      UPDATE "OOMiddleware".order_header
      SET processed_at_pos = $1,
          processed_at_pos_time = $2
      WHERE order_id = ANY($3::bigint[])
    `;
        const values = [processed, currentTime, order_id];
        await index_1.pool.query(updateQuery, values);
        return res.status(200).json({
            message: "Processed at POS successfully",
            processedOrders: order_id,
        });
    }
    catch (error) {
        console.error("Error in processedAtPos:", error);
        return res.status(500).json({
            error: "Failed to process orders at POS",
            details: String(error),
        });
    }
};
exports.processedAtPos = processedAtPos;
