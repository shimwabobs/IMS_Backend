import express from "express"
import authorize from "../middlewares/authorization.js"
import DashboardController from "../controllers/Dashboardcontroller.js"

const router=express.Router()

router.get("/dashboard",authorize,DashboardController.userDashboard);

export default router;