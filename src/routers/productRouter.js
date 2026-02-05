import express from "express";
import productController from "../controllers/productController.js";
import authorize from "../middlewares/authorization.js";

const router=express.Router();

router.post("/addProduct",authorize,productController.addProduct);
router.get("/allProducts",productController.viewAllProducts);
router.put("/editProduct:productId",productController.updateProduct);
router.delete("/:product_id",authorize, productController.deleteProduct);

export default router;