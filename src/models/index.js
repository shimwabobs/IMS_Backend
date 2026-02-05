import ProductModel from "./products.js";
import InventoryModel from "./inventory.js";
import ShopModel from "./shop.js";
import UsersModel from "./users.js";
import SalesModel from "./sales.js";
import StockEntryModel from "./stock_entries.js";


InventoryModel.belongsTo(ProductModel, { foreignKey: "product_id", as: "product" });
ProductModel.hasMany(InventoryModel, { foreignKey: "product_id", as: "inventories" });

ShopModel.hasMany(InventoryModel, { foreignKey: "shop_id", as: "inventories" });
InventoryModel.belongsTo(ShopModel, { foreignKey: "shop_id", as: "shop" });

UsersModel.hasMany(ShopModel, { foreignKey: "user_id", as: "shops" });
ShopModel.belongsTo(UsersModel, { foreignKey: "user_id", as: "owner" });

ShopModel.belongsToMany(ProductModel, {
  through: InventoryModel,
  foreignKey: "shop_id",
  otherKey: "product_id",
  as: "products",
});

ProductModel.belongsToMany(ShopModel, {
  through: InventoryModel,
  foreignKey: "product_id",
  otherKey: "shop_id",
  as: "shops",
});


SalesModel.belongsTo(ProductModel, { 
  foreignKey: "product_id", 
  as: "product",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});


ProductModel.hasMany(SalesModel, { 
  foreignKey: "product_id", 
  as: "sales",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

SalesModel.belongsTo(ShopModel, { 
  foreignKey: "shop_id", 
  as: "shop",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});


ShopModel.hasMany(SalesModel, { 
  foreignKey: "shop_id", 
  as: "sales",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});


StockEntryModel.belongsTo(ProductModel, { 
  foreignKey: "product_id", 
  as: "product",
  onDelete: "RESTRICT", 
  onUpdate: "CASCADE"
});

ProductModel.hasMany(StockEntryModel, { 
  foreignKey: "product_id", 
  as: "stockEntries",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

StockEntryModel.belongsTo(ShopModel, { 
  foreignKey: "shop_id", 
  as: "shop",
  onDelete: "CASCADE", 
  onUpdate: "CASCADE"
});


ShopModel.hasMany(StockEntryModel, { 
  foreignKey: "shop_id", 
  as: "stockEntries",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});


StockEntryModel.belongsTo(UsersModel, { 
  foreignKey: "userId", 
  as: "user",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

UsersModel.hasMany(StockEntryModel, { 
  foreignKey: "userId", 
  as: "stockEntries",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

StockEntryModel.belongsTo(InventoryModel, { 
  foreignKey: "inventoryId", 
  as: "inventory",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

InventoryModel.hasMany(StockEntryModel, { 
  foreignKey: "inventoryId", 
  as: "stockEntries",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

export { ProductModel, InventoryModel, ShopModel, UsersModel, SalesModel, StockEntryModel };