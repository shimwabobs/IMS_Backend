import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const sequelize= new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:"postgres",
        logging:false,
        dialectOptions: {
        ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    }
);

const authenticate=async()=>{
    try{
        await sequelize.authenticate();
        console.log("Connected successful");
    }catch(error){
        console.log("Unconnected",error);
    }
}

authenticate();

export default sequelize;