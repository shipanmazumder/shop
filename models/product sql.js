const db = require("../util/database");

module.exports=class Product{
    constructor(id,title,imgUrl,description,price,qty)
    {
        this.id=id;
        this.title=title;
        this.imgUrl=imgUrl;
        this.description=description;
        this.price=price;
        this.qty=qty;
    }
    save()
    {
        return db.execute("INSERT INTO products (title,imgUrl,description,price,qty) VALUES(?,?,?,?,?)",
        [
            this.title,this.imgUrl,this.description,this.price,this.qty
        ]);
    }
    static fetchAll()
    {
       return db.execute("SELECT * FROM products");
    }
    static findProductById(id)
    {
       return db.execute("SELECT * FROM products WHERE id=?",
       [id]);
    }
    static deleteProduct(id)
    {
         
    }
}