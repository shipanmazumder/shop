const express = require("express");
const route = express.Router();
const adminController=require("../controllers/admin");
const isAuth=require("../middleware/is-auth");
// /admin/add-product =>GET
route.get("/add-product", isAuth,adminController.getAddProduct);
// /admin/products =>GET
route.get("/products", isAuth, adminController.getProducts);

// /admin/add-product =>POST
route.post("/add-product", isAuth,adminController.getPostProduct);
// /admin/edit-product=>GET
route.get("/edit-product/:productID", isAuth, adminController.getEditProduct);
// /admin/edit-product=>POST
route.post("/edit-product", isAuth, adminController.getEditPostProduct);
// /admin/delete-product=>GET
route.delete("/product/:productID", adminController.deleteProduct);
module.exports=route;