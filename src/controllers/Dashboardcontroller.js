import { UsersModel, ShopModel, ProductModel, InventoryModel } from "../models/index.js";


const DashboardController={
    userDashboard:async(req,res)=>{
        try{
            const userId=req.user.id;
            const userData = await UsersModel.findByPk(userId, {
  attributes: ["user_id", "email", "Fullname"],
  include: [
    {
      model: ShopModel,
      as: "shops",
      attributes: ["shop_id", "shop_name"],
      include: [
        {
          model: ProductModel,
          as: "products",
          attributes: ["product_id", "product_name", "price"],
          through: {
            model: InventoryModel,
            attributes: ["quantity"],  // this is correct
          },
        },
      ],
    },
  ],
});


           
            res.status(200).json({
                message:`Dashboard of ${userData.Fullname}`,
                dashboard:userData
            })

        }catch(error){
            res.status(500).json({message:error.message})
        }
    },
}

export default DashboardController;