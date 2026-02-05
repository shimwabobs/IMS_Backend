import sequelize from "../db/db.js";
import { DataTypes, UUIDV4 } from "sequelize";



const SalesModel=sequelize.define("sales",
    {
       sale_id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            allowNull:false

        },
        buyer:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.STRING,
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        totalPrice:{
            type:DataTypes.DECIMAL,
            allowNull:false
        }
    }
)
export default SalesModel;

