import { Op } from "sequelize";
import {
  StockEntryModel,
  InventoryModel,
  ProductModel,
  ShopModel
} from "../models/index.js";

const stockEntryController = {

  // ==========================
  // ADD STOCK ENTRY
  // ==========================
  addStockEntry: async (req, res) => {
    try {
      const { shopId, productId, supplier, description, quantity } = req.body;
      const userId = req.user.id;

      if (!shopId || !productId || !quantity || !supplier) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check shop ownership
      const shop = await ShopModel.findOne({
        where: { shop_id: shopId, user_id: userId }
      });

      if (!shop) {
        return res.status(403).json({ message: "Shop not found or not yours" });
      }

      // Check inventory
      const inventory = await InventoryModel.findOne({
        where: { shop_id: shopId, product_id: productId }
      });

      if (!inventory) {
        return res.status(404).json({ message: "Product not found in this shop" });
      }

      // Create stock entry
      const stockEntry = await StockEntryModel.create({
         shop_id: shopId,
         product_id: productId,
         user_id: userId,
         inventory_id: inventory.id,
         supplier,
         description,
         quantity
      });


      // Update inventory quantity
      inventory.quantity += quantity;
      await inventory.save();

      return res.status(201).json({
        message: "Stock added successfully",
        stockEntry
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // ==========================
  // GET STOCK ENTRIES BY SHOP
  // ==========================
  getStockEntriesByShop: async (req, res) => {
    try {
      const { shopId, startDate, endDate } = req.query;
      const userId = req.user.id;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      // Verify shop ownership
      const shop = await ShopModel.findOne({
        where: { shop_id: shopId, user_id: userId }
      });

      if (!shop) {
        return res.status(403).json({ message: "Unauthorized shop access" });
      }

      const where = { shop_id:shopId };

      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [
            new Date(startDate + "T00:00:00.000Z"),
            new Date(endDate + "T23:59:59.999Z")
          ]
        };
      }

      const entries = await StockEntryModel.findAll({
        where,
        include: [
          {
            model: ProductModel,
            as: "product",
            attributes: ["product_name", "price"]
          }
        ],
        order: [["createdAt", "DESC"]]
      });

      return res.status(200).json({
        success: true,
        count: entries.length,
        data: entries
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export default stockEntryController;
