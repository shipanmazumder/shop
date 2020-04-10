const express = require("express");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const route=express.Router();
route.get("/", shopController.getIndex);
route.get("/products/:productID", shopController.getProduct);
route.get("/products", shopController.getProducts);
route.get("/cart", isAuth, shopController.getCart);
//post
route.post("/cart", isAuth, shopController.getPostCart);
route.get("/delete-cart/:productID/:productPrice", isAuth, shopController.deleteCart);



route.get("/orders", isAuth, shopController.getOrders);
route.get("/orders/:orderId", isAuth, shopController.getInvoice);
route.get("/checkout", isAuth, shopController.getCheckOut)
module.exports=route;