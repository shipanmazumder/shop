const Product = require("../models/product");
const Cart=require("../models/cart");
exports.getIndex=(req,res,next)=>{
    const product=Product.fetchAll()
    .then(([rows,fielddata])=>{
       res.render("shop/index", {
            prods: rows,
            pageTitle: "Product List",
            activeShop: true,
            path: "/",
        });
    })
    .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fielddata]) => {
        res.render("shop/product-list", {
            prods: rows,
            pageTitle: "Product List",
            activeShop: true,
            path: "/products",
        });
    })
    .catch(err => console.log(err));
          
};
exports.getProduct = (req, res, next) => {
    const proId = req.params.productID;
    Product.findProductById(proId)
    .then(([product,fielddata])=>{
        console.log(product);
        res.render("shop/product-details",{
            product:product[0],
            pageTitle:"Product Details",
            path:"/products"
        });
    })
    .catch(err=>console.log(err));
};

exports.getCart=(req,res,next)=>{
    Cart.getCart(cart=>{
        const cartProducts=[];
        Product.fetchAll(products=>{
            for (product of products)
            {
                const cartProductData = cart.products.find(prod => prod.id == product.id);
                if(cartProductData)
                {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty
                    });
                }
            }
            res.render("shop/cart", {
                pageTitle: "Your Cart",
                path:"/cart",
                cartProduct: cartProducts
            });
        })
    });
};
exports.getPostCart=(req,res,next)=>{
    const productID=req.body.productID;
    Product.findProductById(productID, (product) => {
        Cart.addProduct(productID,product.price);
    });
    
   Cart.getCart(cart=>{
        const cartProducts=[];
        Product.fetchAll(products=>{
            for (product of products)
            {
                const cartProductData = cart.products.find(prod => prod.id == product.id);
                if(cartProductData)
                {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty
                    });
                }
            }
            res.render("shop/cart", {
                pageTitle: "Your Cart",
                path:"/cart",
                cartProduct: cartProducts
            });
        })
    });
};
exports.deleteCart=(req,res,next)=>{
    const productID=req.params.productID;
    const productPrice = req.params.productPrice;
    Product.findProductById(productID,product=>{
        if(product)
        {
            Cart.deleteCartProduct(productID,productPrice);
            res.redirect("/cart");
        }
        else{
              return res.redirect("/");
        }
    });
};
exports.getCheckOut=(req,res,next)=>{
    res.render("shop/checkout",{
        pageTitle: "Checkout",
        path:"/checkout"
    });
};