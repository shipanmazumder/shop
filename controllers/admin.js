const Product = require("../models/product");
const fileHelper = require('../util/file');
const ITEM_PER_PAGE = 2;
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
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    if(!image)
    {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product",
            activeAddProduct: true,
            path: "/admin/add-product",
            editing: false,
            key: "danger",
            msg: "Attached file is not an image"
        });
    }
    const imgUrl=image.path;
    const product=new Product({
        title:title,
        price:price,
        description:description,
        imgUrl: imgUrl,
        userId:req.user
    });
    // console.log(req.user);
    product
    .save().then(result=>{
       res.redirect("/admin/products");
    })
   .catch(err => {
       const error = new Error(err);
       error.httpStatusCode = 500;
       return next(error);
   });
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
     })
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
     });
    // res.sendFile(path.join(rootpath, "views", "add-product.html"));
};

exports.getEditPostProduct=(req,res,next)=>{
    const prodId = req.body.id;
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
   
    Product.findById(prodId)
    .then(product=>{

         if (product.userId.toString() !== req.user._id.toString()) {
             return res.redirect('/');
         }
         product.title = title;
         product.price = price;
         product.description = description;
         if (image) {
             fileHelper.deleteFile(product.imgUrl);
             product.imgUrl = image.path;
         }
        return product.save();
    })
    .then(result=>{
        res.redirect("/admin/products");
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.getProducts=(req,res,next)=>{
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .sort({
                    createdAt: -1
                })
                .skip((page - 1) * ITEM_PER_PAGE)
                .limit(ITEM_PER_PAGE);
        })
        .then(products => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Product List",
                activeShop: true,
                path: "/admin/products",
                currentPage: page,
                hasNextPage: ITEM_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
                totalPage: Math.ceil(totalItems / ITEM_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
exports.deleteProduct = (req, res, next) => {
     const prodId=req.params.productID;
     Product.findById(prodId).then(product=>{
         if (!product) {
             return next(new Error('Product not found.'));
         }
         fileHelper.deleteFile(product.imgUrl);
         return Product.deleteOne({
             _id: prodId,
             userId: req.user._id
         });
     })
     .then(() => {
        //  res.redirect('/admin/products');
        res.status(200).json({msg:"Successfully Delete this item"});
     })
     .catch(err => {
        res.status(500).json({msg: "Something Wrong!"});
    });
};