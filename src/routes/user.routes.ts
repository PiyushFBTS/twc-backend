import { Router } from "express";
import { createUser } from "../controller/user/createUser.controller";
import { updateUser } from "../controller/user/updateUser.controller";
import { deleteUser } from "../controller/user/deleteUser.controller";
import { getUserData } from "../controller/user/getUserData.controller";
import { getUserById } from "../controller/user/getUserById.controller";

const router = Router();

// CRUD routes
router.get("/getRole", getUserData);
router.get("/:id", getUserById);
router.post("/createUser", createUser);
router.put("/updateUser", updateUser);
router.post("/deleteUser", deleteUser);

export default router;
