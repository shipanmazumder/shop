const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        activeAddProduct: true,
        path: "/admin/add-product",
        editing: false,
    });
    // res.sendFile(path.join(rootpath, "views", "add-product.html"));
};
exports.getPostProduct = (req, res, next) => {
    console.log(req.user._id);
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product=new Product(title,price,imgUrl,description,null,req.user._id);
    // console.log(req.user);
    product
    .save().then(result=>{
       res.redirect("/admin/products");
    }).catch(err=>console.log(err));
};
exports.getEditProduct = (req, res, next) => {
    const editMode=req.query.edit;
     if (!editMode) {
         return res.redirect("/");
     }
     const prodId=req.params.productID;
   Product.findById(prodId).then(product => {
        //  const product=products[0];
         if (!product) {
             return res.redirect("/");
         }
         res.render("admin/edit-product", {
             pageTitle: "Edit Product",
             activeAddProduct: true,
             editing: editMode,
             path: "/admin/edit-product",
             product: product
         });
     }).catch(err=>console.log(err));
    // res.sendFile(path.join(rootpath, "views", "add-product.html"));
};

exports.getEditPostProduct=(req,res,next)=>{
    const prodId = req.body.id;
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product=new Product(title,price,imgUrl,description,prodId);
    product.save().then(result=>{
        res.redirect("/admin/products");
    }).catch(err=>console.log(err));
}
exports.getProducts=(req,res,next)=>{
    Product.fetchAll().then(products => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Product List",
            activeShop: true,
            path: "/admin/products",
        });
    }).catch(er=>console.log(err));
};
exports.deleteProduct = (req, res, next) => {
     const prodId=req.params.productID;
     Product.findById(prodId).then(product=>{
         if(!product)
         {
             return res.redirect("/");
         }
         Product.deleteProduct(prodId)
         .then(result=>{
             console.log(result);
             res.redirect("/admin/products");
         }).catch(err=>console.log(err));
     }).catch(err=>console.log(err));
};