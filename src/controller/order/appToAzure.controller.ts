import { Request, Response } from "express";
import { pool } from "../../db/index";
import { toPostgresDateTime } from "../../utils/date";

export const appToAzure = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { customer, order } = req.body;
    const details = order.details;

    await client.query("BEGIN");

    // === Insert into order_header ===
    const orderHeaderQuery = `
      INSERT INTO "OOMiddleware"."order_header" (
        order_id, order_channel, customer_phone, customer_email, customer_name,
        order_total_tax, order_payable_amount, order_total, order_type, order_discount,
        order_delivery_datetime, order_status, order_instructions, order_total_charges,
        order_created, order_subtotal, order_payment_amount, order_store, 
        order_store_merchant_ref_id, order_table_no, created_date_time,
        order_ext_platform_id, order_discount_id, order_discount_code,
        order_is_instant_order, order_otp, customer_app_uid,
        order_expected_pickup_time
      ) VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,$17,$18,
        $19,$20,NOW(),
        $21,$22,$23,
        $24,$25,$26,
        $27
      )
    `;

    const headerValues = [
      details.id,
      details.channel,
      customer.phone,
      customer.email,
      customer.name,
      details.total_taxes,
      details.payable_amount,
      details.order_total,
      details.order_type,
      details.discount,
      details.delivery_datetime ? toPostgresDateTime(details.delivery_datetime) : null,
      details.order_state,
      details.instructions || "",
      details.total_charges,
      details.created ?? 0,
      details.order_subtotal,
      details.payable_amount,
      order.store.name,
      order.store.merchant_ref_id,
      details.tableNo ?? "",
      details.ext_platforms?.[0]?.id ?? null,
      details.discount_id || "",
      details.discount_code || "",
      details.ext_platforms?.[0]?.extras?.deliver_asap || false,
      details.ext_platforms?.[0]?.extras?.order_otp || "",
      customer.app_user_id,
      toPostgresDateTime(details.expected_pickup_time),
    ];

    await client.query(orderHeaderQuery, headerValues);

    // === Insert into order_line ===
    let lineNo = 1;
    const itemIdToLineNo = new Map();

    for (const item of order.items) {
      const isDummyItem = item.merchant_id === "DUMMY";
      let dummyBaseLineNo = 0;

      if (!isDummyItem) {
        const cgst = item.taxes?.find((t: any) => t.title === "CGST") || {};
        const sgst = item.taxes?.find((t: any) => t.title === "SGST") || {};
        const TotalWIthTax = item.total + cgst.value + sgst.value || 0;

        const orderLineQuery = `
          INSERT INTO "OOMiddleware".order_line (
            order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
            item_price, item_discount, item_total, item_total_with_tax,
            items_options_to_add_group_is_variant, item_instructions,
            cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
            sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
            items_redeem_subscription_voucher_code, indent, item_id
          ) VALUES (
            $1,$2,$3,$4,$5,$6,
            $7,$8,$9,$10,
            $11,$12,
            $13,$14,$15,$16,
            $17,$18,$19,$20,
            $21,$22,$23
          )
        `;

        const orderLineValues = [
          details.id,
          lineNo,
          0,
          item.merchant_id,
          item.title || "Untitled Item",
          item.quantity || 1,
          item.price || 0,
          item.discount || 0,
          item.total || 0,
          TotalWIthTax || 0,
          "0",
          item.instructions || "",
          cgst.rate || 0,
          cgst.liability_on || "",
          cgst.value || 0,
          cgst.title || "",
          sgst.rate || 0,
          sgst.liability_on || "",
          sgst.value || 0,
          sgst.title || "",
          item.discount_code || "",
          0,
          item.id,
        ];

        await client.query(orderLineQuery, orderLineValues);
        itemIdToLineNo.set(item.id, lineNo);
        lineNo++;
      }

      // === Handle options_to_add (sub items) ===
      for (const [index, option] of (item.options_to_add || []).entries()) {
        const cgst = option.taxes?.find((t: any) => t.title === "CGST") || {};
        const sgst = option.taxes?.find((t: any) => t.title === "SGST") || {};

        const isFirstUnderDummy = isDummyItem && index === 0;
        const parentLineNo = isFirstUnderDummy
          ? 0
          : isDummyItem
          ? dummyBaseLineNo
          : itemIdToLineNo.get(item.id) || 0;

        const indent = isFirstUnderDummy ? 0 : 1;

        const orderLineQuery = `
          INSERT INTO "OOMiddleware".order_line (
            order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
            item_price, item_discount, item_total, item_total_with_tax,
            items_options_to_add_group_is_variant, item_instructions,
            cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
            sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
            items_redeem_subscription_voucher_code, indent, item_id
          ) VALUES (
            $1,$2,$3,$4,$5,$6,
            $7,$8,$9,$10,
            $11,$12,
            $13,$14,$15,$16,
            $17,$18,$19,$20,
            $21,$22,$23
          )
        `;

        const orderLineValues = [
          details.id,
          lineNo,
          parentLineNo,
          option.merchant_id || item.merchant_id,
          option.title || "Untitled Option",
          option.quantity || 1,
          option.price || 0,
          option.discount || 0,
          option.total_price || 0,
          option.total_price + option.total_tax || 0,
          option.group?.is_variant ? "1" : "0",
          option.instructions || "",
          cgst.rate || 0,
          cgst.liability_on || "",
          cgst.value || 0,
          cgst.title || "",
          sgst.rate || 0,
          sgst.liability_on || "",
          sgst.value || 0,
          sgst.title || "",
          option.voucher_code || "",
          indent,
          item.id,
        ];

        await client.query(orderLineQuery, orderLineValues);

        if (isFirstUnderDummy) {
          dummyBaseLineNo = lineNo;
          itemIdToLineNo.set(option.id, lineNo);
        }
        lineNo++;
      }
    }

    // === Insert into order_status ===
    const currentUser = "system"; // (Replace with session user later if needed)
    const orderStatusQuery = `
      INSERT INTO "OOMiddleware".order_status (
        additional_info_name, additional_info_order_id, message, new_state,
        order_id, prev_state, store_id, "timestamp", "Updated_by", "Updated_By_User", created_date_time
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,$9,$10,NOW()
      )
    `;
    const statusValues = [
      details.dash_extra_info || "",
      details.id,
      details.instructions || "",
      details.order_state,
      details.id,
      null,
      order.store.id.toString(),
      toPostgresDateTime(details.created),
      currentUser,
      currentUser,
    ];

    await client.query(orderStatusQuery, statusValues);

    await client.query("COMMIT");
    return res.status(201).json({ message: "Order inserted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("POST /api/orders/insertOrder error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
