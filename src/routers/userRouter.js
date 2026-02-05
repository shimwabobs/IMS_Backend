import express from "express"
import userController from "../controllers/usercontroller.js";
import authorize from "../middlewares/authorization.js";
const router=express.Router();

router.post("/register",userController.register);
router.post("/logout", authorize, userController.logout);
router.post("/verify-otp",userController.verifyOtp);
router.post("/login",userController.login);
router.put("/updatePassword",authorize,userController.changePassword);
router.put("/changeName",authorize,userController.updateFullname);
router.get("/my-stores",authorize,userController.userShops)
export default router;