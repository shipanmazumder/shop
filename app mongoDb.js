const path=require("path");
const express=require("express");
const app = express();
const bodyParser = require("body-parser");
const User=require("./models/user");
app.set("view engine", "ejs");
app.set("views","views");
const adminRoute=require("./routes/admin");
const shopRoute=require("./routes/shop");
const errorController = require('./controllers/error');

const mongoConnect=require("./util/database").mongoConnect;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "public")));
app.use((req,res,next)=>{
    User.findById("5d53d675d39a10164c0e42c3")
    .then(user=>{
       req.user=user;
       next();
    })
    .catch(err=>console.log(err));
});
app.use("/admin/",adminRoute);
app.use(shopRoute);
app.use(errorController.get404);

mongoConnect(()=>{
    app.listen(3000);
});
