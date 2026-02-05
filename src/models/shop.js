import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import UsersModel from "./users.js";
import InventoryModel from "./inventory.js";

const ShopModel=sequelize.define("shops",{
    shop_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    shop_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

export default ShopModel;



