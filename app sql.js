const path=require("path");
const express=require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize=require("./util/database");
const Product=require("./models/product");
const User=require("./models/user");
const Cart=require("./models/cart");
const CartItem=require("./models/cart-item");
app.set("view engine", "ejs");
app.set("views","views");

const adminRoute=require("./routes/admin");
const shopRoute=require("./routes/shop");
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "public")));
app.use((req,res, next) => {
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use("/admin",adminRoute);

app.use(shopRoute);

app.use(errorController.get404);
Product.belongsTo(User,{constraints:true,onDelete:"CASCADE"});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
sequelize
// .sync({force:true})
.sync()
.then(result=>{
    return User.findByPk(1);
})
.then(user=>{
    if(!user)
    {
        return User.create({name:"ss",email:"ss@gmail.com"});
    }
    return user;
})
.then(user=>{
    return user.createCart();
})
.then(cart=>{
    console.log(cart);
    app.listen(3000);

})
.catch(err=>console.log(err));