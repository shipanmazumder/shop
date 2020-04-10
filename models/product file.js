const path=require("path");
const fs=require("fs");
const Cart=require("./cart");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
);

const getProductFromFile = cb => {
    fs.readFile(p, (err, filecontent) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(filecontent));
        }
    });
};

module.exports=class Product{
    constructor(id,title,imgUrl,description,price)
    {
        this.id=id;
        this.title=title;
        this.imgUrl=imgUrl;
        this.description=description;
        this.price=price;
    }
    save()
    {
        getProductFromFile(products=>{
            if(this.id)
            {
                const exitsProductIndex=products.findIndex(prod=>prod.id===this.id);
                const updateProducts = [...products];
                updateProducts[exitsProductIndex]=this;
                 fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                     console.log(err);
                 });
            }else{
                this.id=Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }
    static fetchAll(cb)
    {
        getProductFromFile(cb);
    }
    static findProductById(id,cb)
    {
        getProductFromFile(products=>{
            const product=products.find(p=>p.id==id);
            cb(product);
        });
    }
    static deleteProduct(id)
    {
         getProductFromFile(products => {
             const product=products.find(prod=>prod.id===id);
             const updateProducts = products.filter(p => p.id !== id);
             fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                 if(!err)
                 {
                     Cart.deleteCartProduct(id,product.price);
                 }
             });
         });
    }
}