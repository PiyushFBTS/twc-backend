"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noOfOrders_controller_1 = require("../controller/dashboard/card/noOfOrders.controller");
const posDeliveredOrders_controller_1 = require("../controller/dashboard/card/posDeliveredOrders.controller");
const posFetchedOrders_controller_1 = require("../controller/dashboard/card/posFetchedOrders.controller");
const orderList_controller_1 = require("../controller/dashboard/orderList.controller");
const getOrderById_controller_1 = require("../controller/dashboard/getOrderById.controller");
const outletwiseOrders_controller_1 = require("../controller/dashboard/outletwiseOrders.controller");
const todaysTop10Amount_controller_1 = require("../controller/dashboard/piecard/today/todaysTop10Amount.controller");
const todaysTop10Qty_controller_1 = require("../controller/dashboard/piecard/today/todaysTop10Qty.controller");
const thisMonthTodaysTop10Amount_controller_1 = require("../controller/dashboard/piecard/monthly/thisMonthTodaysTop10Amount.controller");
const thisMonthTodaysTop10Qty_controller_1 = require("../controller/dashboard/piecard/monthly/thisMonthTodaysTop10Qty.controller");
const router = (0, express_1.Router)();
// Card
router.get("/noOfOrders", noOfOrders_controller_1.noOfOrders);
router.get("/posDeliveredOrders", posDeliveredOrders_controller_1.posDeliveredOrders);
router.get("/posFetchedOrders", posFetchedOrders_controller_1.posFetchedOrders);
// order List
router.get("/orderList", orderList_controller_1.orderList);
router.get("/getOrderById/:id", getOrderById_controller_1.getOrderById);
router.get("/outletwiseOrders", outletwiseOrders_controller_1.outletwiseOrders);
// PIE-CHART → Today
router.get("/pie-chart/today/todaysTop10Amount", todaysTop10Amount_controller_1.todaysTop10Amount);
router.get("/pie-chart/today/todaysTop10Qty", todaysTop10Qty_controller_1.todaysTop10Qty);
// PIE-CHART → Monthly
router.get("/pie-chart/monthly/thisMonthTodaysTop10Amount", thisMonthTodaysTop10Amount_controller_1.thisMonthTodaysTop10Amount);
router.get("/pie-chart/monthly/thisMonthTodaysTop10Qty", thisMonthTodaysTop10Qty_controller_1.thisMonthTodaysTop10Qty);
exports.default = router;
