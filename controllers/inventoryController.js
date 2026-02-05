import InventoryModel from "../models/inventory.js"



const inventoryController={
    newReport:async(req,res)=>{
        const {}=req.body()
        const newReport=await InventoryModel.create({

        })
    },

    deleteReport:async(req,res)=>{
        try{
            const {inventory_id}=req.body;
            const deleteInventory= await InventoryModel.destroy({where:{inventory_id:inventory_id}})
        }
        catch(error){
            res.status(500).json({message:error.message})
        }
    }
}

export default inventoryController;