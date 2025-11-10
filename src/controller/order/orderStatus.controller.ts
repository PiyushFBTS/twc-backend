import { Request, Response } from "express";
import { pool } from "../../db/index";

// Status order hierarchy
const STATUS_ORDER: Record<string, number> = {
  PLACED: 1,
  ACKNOWLEDGED: 2,
  FOOD_READY: 3,
  COMPLETED: 4,
};

/**
 * Controller: orderStatus
 * Description: Handles order status updates with sequential validation
 */
export const orderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, ReceiptNo, orderStatus, storeId } = req.body;

    // Validate required fields
    if (!orderId || !ReceiptNo || !orderStatus || !storeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Check if order exists
    const orderCheck = await pool.query(
      `SELECT 1 FROM "OOMiddleware".order_header WHERE order_id = $1`,
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Normalize and validate incoming status
    const incomingStatus = String(orderStatus).toUpperCase();
    if (!(incomingStatus in STATUS_ORDER)) {
      return res
        .status(400)
        .json({ error: `Invalid incoming status: ${incomingStatus}` });
    }

    const incomingNum = STATUS_ORDER[incomingStatus];

    // 2️⃣ Get latest status row for this order
    const latestRes = await pool.query(
      `SELECT * 
         FROM "OOMiddleware".order_new_status 
        WHERE order_id = $1 
        ORDER BY modified_time DESC, order_status_id DESC 
        LIMIT 1`,
      [orderId]
    );
    const latest = latestRes.rows[0] ?? null;

    // 3️⃣ Validate state transitions
    if (latest) {
      const latestStatus = String(latest.order_status).toUpperCase();

      if (!(latestStatus in STATUS_ORDER)) {
        return res
          .status(500)
          .json({ error: `Invalid stored latest status: ${latestStatus}` });
      }

      const latestNum = STATUS_ORDER[latestStatus];

      // Same status → reject
      if (latestNum === incomingNum) {
        return res.status(409).json({
          error: `Order is already ${latestStatus}`,
        });
      }

      // Incoming must be exactly next numeric step
      if (incomingNum !== latestNum + 1) {
        const allowedNext =
          Object.keys(STATUS_ORDER).find(
            (k) => STATUS_ORDER[k] === latestNum + 1
          ) ?? "none";
        return res.status(400).json({
          error: `Invalid status transition from ${latestStatus} -> ${incomingStatus}. Allowed next: ${allowedNext}`,
        });
      }
    } else {
      // First ever status must be PLACED
      if (incomingStatus !== "PLACED") {
        return res
          .status(400)
          .json({ error: `First status must be PLACED. Received: ${incomingStatus}` });
      }
    }

    // 4️⃣ Check if "prev_status" column exists
    const colRes = await pool.query(
      `SELECT column_name
         FROM information_schema.columns
        WHERE table_schema = $1 
          AND table_name = $2 
          AND column_name = $3`,
      ["OOMiddleware", "order_new_status", "prev_status"]
    );
    const hasPrevStatus = colRes.rows.length > 0;

    // 5️⃣ Insert the new order status
    let insertQuery: string;
    let insertValues: any[];

    if (hasPrevStatus) {
      insertQuery = `
        INSERT INTO "OOMiddleware".order_new_status
          (order_id, store_id, receipt_no, order_status, prev_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      insertValues = [
        orderId,
        storeId,
        ReceiptNo,
        incomingStatus,
        latest ? latest.order_status : null,
      ];
    } else {
      insertQuery = `
        INSERT INTO "OOMiddleware".order_new_status
          (order_id, store_id, receipt_no, order_status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      insertValues = [orderId, storeId, ReceiptNo, incomingStatus];
    }

    const insertRes = await pool.query(insertQuery, insertValues);

    return res.status(200).json({
      message: "Order status inserted successfully",
      row: insertRes.rows[0],
    });
  } catch (error: any) {
    console.error("POST /orders/status error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: String(error) });
  }
};
