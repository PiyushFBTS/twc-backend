import { Router } from "express";
import { fetchedByPos } from "../controller/pos/fetchedByPos.controller";
import { processedAtPos } from "../controller/pos/processedAtPos.controller";

const router = Router();

// POS APIs
router.put("/fetchedByPos", fetchedByPos);
router.put("/processedAtPos", processedAtPos);

export default router;
