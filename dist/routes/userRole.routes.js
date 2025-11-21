"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUserRole_controller_1 = require("../controller/userRole/createUserRole.controller");
const getUserRoleById_controller_1 = require("../controller/userRole/getUserRoleById.controller");
const getUserRoleData_controller_1 = require("../controller/userRole/getUserRoleData.controller");
const getRole_controller_1 = require("../controller/userRole/getRole.controller");
const router = (0, express_1.Router)();
// Create a new role
router.post("/createUserRole", createUserRole_controller_1.createUserRole);
// Get all roles
router.get("/", getUserRoleData_controller_1.getUserRoleData);
// Get role list (role_code, role_name only)
router.get("/list", getRole_controller_1.getUserRoleList);
// Get role by ID
router.get("/:id", getUserRoleById_controller_1.getUserRoleById);
exports.default = router;
