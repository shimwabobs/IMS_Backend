import sequelize from "../db/db.js";
import { DataTypes, UUIDV4 } from "sequelize";
import InventoryModel from "./inventory.js";


const stockEntryModel=sequelize.define("stockEntry",
    {
       entry_id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            allowNull:false
        },
        supplier:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.STRING,
        },
       quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
           min:0
        }
    }
        
    }
)
export default stockEntryModel;

