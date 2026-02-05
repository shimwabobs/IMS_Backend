import express from "express"
import shopController from "../controllers/shopController.js";
import authorize from "../middlewares/authorization.js";
const router=express.Router();

router.post("/new-shop",authorize,shopController.newShop);
router.put("/updatename",authorize,shopController.renameShop);
router.delete("/:shop_id", authorize, shopController.deleteShop);


export default router;
