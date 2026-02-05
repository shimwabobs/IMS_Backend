import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import ShopModel from "./shop.js";
const UsersModel=sequelize.define("users",
    {
        user_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique:true
        },
        Fullname:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                min:6
            }
        },
        
        otp: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verified:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
    },{
        timestamps:true
    }
)



export default UsersModel;