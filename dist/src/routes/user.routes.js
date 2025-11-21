"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUser_controller_1 = require("../controller/user/createUser.controller");
const updateUser_controller_1 = require("../controller/user/updateUser.controller");
const deleteUser_controller_1 = require("../controller/user/deleteUser.controller");
const getUserData_controller_1 = require("../controller/user/getUserData.controller");
const getUserById_controller_1 = require("../controller/user/getUserById.controller");
const router = (0, express_1.Router)();
// CRUD routes
router.get("/getRole", getUserData_controller_1.getUserData);
router.get("/:id", getUserById_controller_1.getUserById);
router.post("/createUser", createUser_controller_1.createUser);
router.put("/updateUser", updateUser_controller_1.updateUser);
router.post("/deleteUser", deleteUser_controller_1.deleteUser);
exports.default = router;
