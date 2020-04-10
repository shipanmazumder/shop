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
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null,title,imgUrl,description,price,1);
    product.save()
    .then(results=>{
        res.redirect("/products");
    })
    .catch(err=>console.log(err));
};
exports.getEditProduct = (req, res, next) => {
    const editMode=req.query.edit;
     if (!editMode) {
         return res.redirect("/");
     }
     const prodId=req.params.productID;
     Product.findProductById(prodId,(product)=>{
         if(!product)
         {
            return res.redirect("/");
         }
         res.render("admin/edit-product", {
             pageTitle: "Edit Product",
             activeAddProduct: true,
             editing: editMode,
             path: "/admin/edit-product",
             product:product
         });
     });
    // res.sendFile(path.join(rootpath, "views", "add-product.html"));
};

exports.getEditPostProduct=(req,res,next)=>{
    const prodId = req.body.id;
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(prodId, title, imgUrl, description, price);
    product.save();
    res.redirect("/products");
}
exports.getProducts=(req,res,next)=>{
     Product.fetchAll((products) => {
         res.render("admin/products", {
             prods: products,
             pageTitle: "Admin Product List",
             activeShop: true,
             path: "/admin/products",
         });
     });
};
exports.deleteProduct = (req, res, next) => {
     const prodId=req.params.productID;
     Product.findProductById(prodId,product=>{
        if(!product)
        {
            return res.redirect("/");
        }
     });
     Product.deleteProduct(prodId);
     res.redirect("/products");
};