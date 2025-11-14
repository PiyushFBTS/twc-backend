import { Router } from "express";
import { noOfOrders } from "../controller/dashboard/card/noOfOrders.controller";
import { posDeliveredOrders } from "../controller/dashboard/card/posDeliveredOrders.controller";
import { posFetchedOrders } from "../controller/dashboard/card/posFetchedOrders.controller";
import { orderList } from "../controller/dashboard/orderList.controller";
import { getOrderById } from "../controller/dashboard/getOrderById.controller";
import { outletwiseOrders } from "../controller/dashboard/outletwiseOrders.controller";
import { todaysTop10Amount } from "../controller/dashboard/piecard/today/todaysTop10Amount.controller";
import { todaysTop10Qty } from "../controller/dashboard/piecard/today/todaysTop10Qty.controller";
import { thisMonthTodaysTop10Amount } from "../controller/dashboard/piecard/monthly/thisMonthTodaysTop10Amount.controller";
import { thisMonthTodaysTop10Qty } from "../controller/dashboard/piecard/monthly/thisMonthTodaysTop10Qty.controller";

const router = Router();

// Card
router.get("/noOfOrders", noOfOrders);
router.get("/posDeliveredOrders", posDeliveredOrders);
router.get("/posFetchedOrders", posFetchedOrders);

// order List
router.get("/orderList", orderList);
router.get("/getOrderById/:id", getOrderById);
router.get("/outletwiseOrders", outletwiseOrders);



// PIE-CHART → Today
router.get("/pie-chart/today/todaysTop10Amount", todaysTop10Amount);
router.get("/pie-chart/today/todaysTop10Qty", todaysTop10Qty);

// PIE-CHART → Monthly
router.get("/pie-chart/monthly/thisMonthTodaysTop10Amount", thisMonthTodaysTop10Amount);
router.get("/pie-chart/monthly/thisMonthTodaysTop10Qty", thisMonthTodaysTop10Qty);

export default router;
