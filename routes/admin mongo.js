const express = require("express");
const route = express.Router();
const adminController=require("../controllers/admin");
// /admin/add-product =>GET
route.get("/add-product",adminController.getAddProduct);
// /admin/products =>GET
route.get("/products",adminController.getProducts);

// /admin/add-product =>POST
route.post("/add-product",adminController.getPostProduct);
// /admin/edit-product=>GET
route.get("/edit-product/:productID", adminController.getEditProduct);
// /admin/edit-product=>POST
route.post("/edit-product", adminController.getEditPostProduct);
// /admin/delete-product=>GET
route.get("/delete-product/:productID", adminController.deleteProduct);

module.exports=route;