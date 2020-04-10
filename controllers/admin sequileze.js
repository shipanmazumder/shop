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
    // console.log(req.user);
    req.user
    .createProduct({
        title:title,
        price:price,
        imgUrl:imgUrl,
        description:description
    }).then(result=>{
       res.redirect("/admin/products");
    }).catch(err=>console.log(err));
};
exports.getEditProduct = (req, res, next) => {
    const editMode=req.query.edit;
     if (!editMode) {
         return res.redirect("/");
     }
     const prodId=req.params.productID;
     req.user.getProducts({
             where: {
                 id:prodId
             }
         }).then(products => {
         const product=products[0];
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
    Product.update({
        title: title,
        price: price,
        imgUrl: imgUrl,
        description: description
    },{
        where:{
            id:prodId
        }
    }).then(result=>{
        res.redirect("/admin/products");
    }).catch(err=>console.log(err));
}
exports.getProducts=(req,res,next)=>{
    Product.findAll().then(products => {
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
     Product.findByPk(prodId).then(product=>{
         if(!product)
         {
             return res.redirect("/");
         }
         Product.destroy({
             where: {
                 id: prodId
             }
         }).then(result=>{
             res.redirect("admin/products");
         }).catch(err=>console.log(err));
     }).catch(err=>console.log(err));
};