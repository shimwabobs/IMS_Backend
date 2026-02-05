import sequelize from "../db/db.js";
import { DataTypes, UUIDV4 } from "sequelize";
import InventoryModel from "./inventory.js";


const ProductModel=sequelize.define("products",
    {
       product_id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            primaryKey:true

        },
        product_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        price:{
            type:DataTypes.DECIMAL,
            allowNull:false
        }
    }
)





export default ProductModel;

