import { Router } from "express";
import { appToAzure } from "../controller/order/appToAzure.controller";
import { upToAzure } from "../controller/order/upToAzure.controller";
import { azureToPOS } from "../controller/order/azureToPOS.controller";
import { orderStatus } from "../controller/order/orderStatus.controller";

const router = Router();

//POST
router.post("/appToAzure", appToAzure);
router.post("/upToAzure", upToAzure);
router.post("/status", orderStatus);

//send data
router.post("/azureToPOS", azureToPOS);


export default router;
