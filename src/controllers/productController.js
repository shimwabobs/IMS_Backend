import { UsersModel, ShopModel, ProductModel, InventoryModel } from "../models/index.js";


const productController={
    addProduct:async(req,res)=>{
        try{
            const {shop_id,product_name,quantity,price}=req.body;
            const userId=req.user.id;

            const shop=await ShopModel.findOne({where:{shop_id:shop_id,user_id:userId}})

            if(!shop) return res.status(400).json({message:"Shop not found or not Yours"});

            const product=await ProductModel.create({product_name,price})
        
            await InventoryModel.create({
                shop_id:shop.shop_id,
                product_id:product.product_id,
                quantity
            })

        
            return res.status(201).json({message:"Product created"})
        }catch(error){
            return res.status(500).json({error:error.message})
        }
    },
    viewAllProducts:async(req,res)=>{
        try{
            const response= await ProductModel.findAll();
            return res.status(200).json({response})
        }catch(error){
            return res.status(500).json({error:error.message})
        }
    },
    updateProduct:async(req,res)=>{
        try{
            const {productId}=req.params;
            const{productName}=req.body;
            const response=await ProductModel.update({productName:productName},{where:{productId:productId}})
        }catch(error){
            res.status(500).json({message:error.message})
        }
    },

deleteProduct: async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await ProductModel.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

}

export default productController;