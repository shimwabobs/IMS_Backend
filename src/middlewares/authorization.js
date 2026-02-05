
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const authorize=async(req,res,next)=>{
    const token= req.cookies.token;
    
    if(!token){
        return res.status(403).send({message:"Token required"});
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(403).send({message:"Wrong token"});
        }
        req.user=decoded;
        next();
    })
    
}

export default authorize;