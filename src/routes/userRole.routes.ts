import { Router } from "express";
import { createUserRole } from "../controller/userRole/createUserRole.controller";
import { getUserRoleById } from "../controller/userRole/getUserRoleById.controller";
import { getUserRoleData } from "../controller/userRole/getUserRoleData.controller";
import { getUserRoleList } from "../controller/userRole/getRole.controller";

const router = Router();

// Create a new role
router.post("/createUserRole", createUserRole);

// Get all roles
router.get("/", getUserRoleData);

// Get role list (role_code, role_name only)
router.get("/list", getUserRoleList);

// Get role by ID
router.get("/:id", getUserRoleById);



export default router;
