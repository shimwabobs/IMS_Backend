import express from "express";

import authorize from "../middlewares/authorization.js";
import stockEntryController from "../controllers/stockEntryController.js";

const router=express.Router();

router.post("/newStock",authorize,stockEntryController.addStockEntry);
router.get("/allEntries",authorize,stockEntryController.getStockEntriesByShop);


export default router;