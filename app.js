const path=require("path");
const fs=require("fs");
const express=require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const session=require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const csurf=require("csurf");
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
// const compression = require('compression');
const morgan = require('morgan');

const adminRoute=require("./routes/admin");
const shopRoute=require("./routes/shop");
const authRoute=require("./routes/auth");
const errorController = require('./controllers/error');
const User=require("./models/user");
const shopController = require("./controllers/shop");
const isAuth = require("./middleware/is-auth");
const MONGODBURI = "mongodb+srv://shipan:shipan@cluster0-ec7w0.mongodb.net/shop";
const app = express();
const store=new MongoDBStore({
    uri:MONGODBURI,
    collection:"sessions"
});
const csurfProtection=csurf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
       const currentDate = new Date().toISOString();
       const customizedDate = currentDate.replace(/:/g, '-');
       cb(null, customizedDate + '-' + file.originalname);
    }
});
const accesslogStream=fs.createWriteStream(
    path.join(__dirname,"ascces.log"),{flags:"a"}
);
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set("view engine", "ejs");
app.set("views","views");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(helmet());
// app.use(compression());
app.use(morgan("combined",{stream:accesslogStream}));
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images",express.static(path.join(__dirname, "images")));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
    store:store
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
app.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => next(new Error(err)));
});
app.post("/createOrder", isAuth, shopController.postOrder);
app.use(csurfProtection);
app.use((req, res, next) => {
    res.locals.csrftoken = req.csrfToken();
    next();
});
app.use("/admin/",adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((error,req,res,next)=>{
     res.status(500).render('500', {
         pageTitle: 'Error!',
         path: '/500',
     });
});

mongoose.connect(MONGODBURI, {
    useNewUrlParser: true
})
.then(result=>{
    app.listen(process.env.PORT || 3000);
})
.catch(err=>console.log(err));