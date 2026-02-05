
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import { UsersModel, ShopModel, ProductModel, InventoryModel } from "../models/index.js";


dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}



const userController = {
  register: async (req, res) => {
  try {
    const { Fullname, email, role, password } = req.body;

    const existingUser = await UsersModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await UsersModel.create({
      Fullname,
      email,
      role,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,
    });

    await sendEmail({
      to: email,
      subject: "SMART IMS: Your Verification OTP",
      text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return res.status(201).json({ message: "OTP sent to email", email });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message });
  }
},
logout:async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
},

verifyOtp: async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("DB OTP:", user.otp, typeof user.otp);
    console.log("Received OTP:", otp, typeof otp);


    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "User verified and logged in", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

login: async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(!user.verified){
      return res.status(400).json({message:"User not verified"});
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(401).json({ message: "Password is not valid" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      path: "/", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        fullname: user.Fullname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},

  updateFullname: async (req, res) => {
    try {
      const { newFullname, oldFullname } = req.body;
      const response = await UsersModel.update(
        { Fullname: newFullname },
        { where: { Fullname: oldFullname } }
      );

      return res.status(200).json({ message: "Update successful", response });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { newPassword, email } = req.body;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const response = await UsersModel.update(
        { password: hashedPassword },
        { where: { email } }
      );

      return res.status(200).json({ message: "Password changed", response });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  userShops:async (req,res) => {
    try{
      const user_id=req.user.id;
      const userwithShops=await UsersModel.findByPk(user_id,{
        attributes:["user_id","Fullname","email"],
        include:[
          {
            model:ShopModel,
            as:"shops",
            attributes:["shop_id","shop_name"],
            include:[
              {
                model:ProductModel,
                as:"products",
                attributes:["product_id","product_name","price"],
                through:{
                  model:InventoryModel,
                  attributes:["quantity"]
                }
              },
            ],
          },
        ],
      });

      if(!userwithShops){
        return res.status(404).json({message:"No user found"})
      }

      const shopswithProducts = userwithShops.shops.map((shop) => {
  return {
    ...shop.toJSON(),
    products: shop.products.map((product) => {
      const { inventory, ...rest } = product.toJSON(); 
      return {
        ...rest,
        quantity: inventory?.quantity,
      };
    }),
  };
});

      res.status(200).json({message:`List of shops owned by ${userwithShops.Fullname}`,
        shops:shopswithProducts})
    }
    catch(error){
      res.status(500).json({
        message:error.message
      })
    }
  }
};

export default userController;
