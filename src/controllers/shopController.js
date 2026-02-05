import { UsersModel, ShopModel } from "../models/index.js";


const shopController={
    newShop:async(req,res)=>{
        try{
            const userId=req.user.id
            const {shop_name,location}=req.body

            const shop=await ShopModel.create({user_id:userId,shop_name,location});
            res.status(201).json({message:"Shop created",shop})

        }
        catch(error){
            res.status(500).json({message:error.message})
        }
    },

    renameShop:async(req,res)=>{
        try{
            const {shop_id,new_name}=req.body;
            const rename= await ShopModel.update({shop_name:new_name},{where:{shop_id:shop_id}});
        }catch(error){
            res.status(500).json({message:error.message})
        }

    },


deleteShop: async (req, res) => {
  try {
    const { shop_id } = req.params;

    const shop = await ShopModel.findByPk(shop_id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    await shop.destroy();

    return res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


}


export default shopController;