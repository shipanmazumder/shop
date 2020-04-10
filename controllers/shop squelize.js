const Product = require("../models/product");
const Cart=require("../models/cart");
exports.getIndex=(req,res,next)=>{
    Product.findAll()
    .then((products)=>{
       res.render("shop/index", {
            prods: products,
            pageTitle: "Product List",
            activeShop: true,
            path: "/",
        });
    })
    .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products=> {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "Product List",
            activeShop: true,
            path: "/products",
        });
    })
    .catch(err => console.log(err));
          
};
exports.getProduct = (req, res, next) => {
    const proId = req.params.productID;
    Product.findByPk(proId)
    .then(product => {
        console.log(product);
        res.render("shop/product-details",{
            product:product,
            pageTitle: product.title,
            path:"/products"
        });
    })
    .catch(err=>console.log(err));
};

exports.getCart=(req,res,next)=>{
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts()
        .then(products=>{
            res.render("shop/cart", {
                pageTitle: "Your Cart",
                path:"/cart",
                cartProduct: products
            });
        }).then(err=>console.log(err));
    //   console.log(cart);  
    })
    .catch(err=>console.log(err));
};
exports.getPostCart=(req,res,next)=>{
    const productID=req.body.productID;
    let fetchedCart;
    let newQty=1;
    req.user
    .getCart()
    .then(cart=>{
        fetchedCart=cart;;
        return cart.getProducts({where:{id:productID}});
    })
    .then(products=>{
        let product;
        if(products.length>0)
        {
            product=products[0];
        }
        if(product)
        {
            let old_qty=product.cartitem.qty;
             newQty=old_qty+1;
             return product;
        }
        return Product.findByPk(productID);
    })
    .then(product=>{
        return fetchedCart.addProduct(product,{
            through:{qty:newQty}  
        });
    })
    .then(result=>{
        res.redirect("/cart");
    })
    .catch(err=>console.log(cart));
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