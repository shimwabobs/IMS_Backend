import User from "./userRouter.js";
import Product from "./productRouter.js";
import Shop from "./shopRouter.js";
import Dashboard from "./dashboardrouter.js";
import express from "express";
import Sales from "./salesRouter.js";
import Stock from "./stockEntry.js"
const api=express()


api.use("/api/v1/user",User)
api.use("/api/v1/product",Product);
api.use("/api/v1/shop",Shop);
api.use("/api/v1/dashboard",Dashboard);
api.use("/api/v1/sales",Sales);
api.use("/api/v1/stock",Stock)

export default api;