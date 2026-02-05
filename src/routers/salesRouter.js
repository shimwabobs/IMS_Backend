import express from "express";
import salesController from "../controllers/salesController.js";
import authorize from "../middlewares/authorization.js";

const router=express.Router();

router.post("/newSale",authorize,salesController.addSale);
router.get("/allSales",authorize,salesController.getSales);

export default router;