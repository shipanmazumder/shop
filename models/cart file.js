const path = require("path");
const fs = require("fs");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
);
module.exports=class Cart{
    static addProduct(id,productPrice)
    {
        fs.readFile(p,(err,filecontent)=>{
            let cart={products:[],totalPrice:0};
            if(!err)
            {
                cart=JSON.parse(filecontent);
            }
            const exitstingProductIndex=cart.products.findIndex(prod=>prod.id==id);
            const exitstingProduct=cart.products[exitstingProductIndex];
            let updateProduct;
            if(exitstingProduct)
            {
                updateProduct={...exitstingProduct};
                updateProduct.qty = updateProduct.qty+1;
                cart.products=[...cart.products];
                cart.products[exitstingProductIndex]=updateProduct;
            }else{
                updateProduct={id:id,qty:1};
                cart.products=[...cart.products,updateProduct]
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        });
    }
    static getCart(cb)
    {
          fs.readFile(p, (err, filecontent) => {
              const cart=JSON.parse(filecontent);
              if(err)
              {
                  cb(null);
              }
              else{
                  cb(cart);
              }
          });
    }
    static deleteCartProduct(id,productPrice)
    {
          fs.readFile(p, (err, filecontent) => {
              if(err)
              {
                  return;
              }
              const updateCartProduct={...JSON.parse(filecontent)};
              console.log(updateCartProduct);
              const product = updateCartProduct.products.find(prod=>prod.id===id);
              if (!product)
              {
                  return;
              }
              const productQty=product.qty;
              updateCartProduct.products = updateCartProduct.products.filter(prod => prod.id !== id);
              updateCartProduct.totalPrice = updateCartProduct.totalPrice - productPrice * productQty;
               fs.writeFile(p, JSON.stringify(updateCartProduct), (err) => {
                   console.log(err);
               });
          });
    }
}