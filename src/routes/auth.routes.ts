import { Router } from "express";
import { login } from "../controller/auth/login.controller";

const router = Router();

router.post("/login", login);

export default router;
