import { Op } from "sequelize";
import { SalesModel ,ProductModel,InventoryModel} from "../models/index.js";

const salesController={
    addSale: async (req, res) => {
  try {
    const { productId, shopId, buyer, description, quantity } = req.body;

    if (!shopId || !productId)
      return res.status(400).json({ message: "shopId and productId required" });

    const inventory = await InventoryModel.findOne({
      where: {
        product_id: productId,
        shop_id: shopId
      }
    });

    if (!inventory)
      return res.status(404).json({ message: "Product not found in this shop" });

    if (inventory.quantity < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const product = await ProductModel.findByPk(productId);

    const totalPrice = Number(product.price) * quantity;

    await SalesModel.create({
      product_id: productId,
      shop_id: shopId,
      buyer,
      description,
      quantity,
      totalPrice
    });

    inventory.quantity -= quantity;
    await inventory.save();
    await checkLowStockAndNotify(productId, shopId);

    return res.status(201).json({ message: "Sale recorded", totalPrice });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

getSales: async (req, res) => {
  try {
    const { shopId, startDate, endDate } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId is required" });
    }

    let where = { shop_id: shopId };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        [Op.between]: [start, end],
      };
    }

    const sales = await SalesModel.findAll({
      where,
      include: [
        {
          model: ProductModel,
          as: "product",
          attributes: ["product_name", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales",
    });
  }
}
}






export default salesController;