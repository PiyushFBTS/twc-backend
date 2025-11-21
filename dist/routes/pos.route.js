"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetchedByPos_controller_1 = require("../controller/pos/fetchedByPos.controller");
const processedAtPos_controller_1 = require("../controller/pos/processedAtPos.controller");
const router = (0, express_1.Router)();
// POS APIs
router.put("/fetchedByPos", fetchedByPos_controller_1.fetchedByPos);
router.put("/processedAtPos", processedAtPos_controller_1.processedAtPos);
exports.default = router;
