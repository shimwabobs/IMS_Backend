import { DataTypes, UUIDV4 } from "sequelize"
import sequelize from "../db/db.js"
import ProductModel from "./products.js";
import ShopModel from "./shop.js";
import { v4 as uuidv4 } from 'uuid';

function generateId(){
    return uuidv4().replace(/-/g,'').substring(6);
}
const InventoryModel=sequelize.define("inventory",{
    inventory_id:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4,
        primaryKey:true
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
           min:0
        }
    }
})



export default InventoryModel;
