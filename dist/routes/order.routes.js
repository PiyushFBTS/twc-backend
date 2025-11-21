"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appToAzure_controller_1 = require("../controller/order/appToAzure.controller");
const upToAzure_controller_1 = require("../controller/order/upToAzure.controller");
const azureToPOS_controller_1 = require("../controller/order/azureToPOS.controller");
const orderStatus_controller_1 = require("../controller/order/orderStatus.controller");
const router = (0, express_1.Router)();
//POST
router.post("/appToAzure", appToAzure_controller_1.appToAzure);
router.post("/upToAzure", upToAzure_controller_1.upToAzure);
router.post("/status", orderStatus_controller_1.orderStatus);
//POST
router.post("/azureToPOS", azureToPOS_controller_1.azureToPOS);
exports.default = router;
