const bcrypt=require("bcryptjs");
const crypto=require("crypto");
const nodemailer=require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const {validationResult } = require('express-validator');
const User=require("../models/user");
const transporter=nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: 'API KEY'
    }
}));
exports.signup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        key: req.flash("key"),
        msg: req.flash("msg")
    });
}
exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //   req.flash("key","danger");
        //   req.flash("msg", errors.array()[0].msg);
        //   return res.status(422).redirect('/signup');
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign UP',
            key: "danger",
            msg: errors.array()[0].msg
        });
      }
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc)
        {
            req.flash("key","warning");
            req.flash("msg","Email Already Exits!");
            return res.redirect("/signup");
        }
        return bcrypt.hash(password, 12)
            .then(hasPassword => {
                const user = new User({
                    name: name,
                    email: email,
                    password: hasPassword,
                    cart: {
                        items: []
                    }
                });
                return user.save();
            })
            .then(result => {
                res.redirect("/login");
                return transporter.sendMail({
                    to:email,
                    from:"sheponmazumder35@gmail.com",
                    subject:"SignUp Successfully",
                    html:"<h1>You Successfully Signed Up</h1>"
                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.login = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        key: req.flash("key"),
        msg: req.flash("msg")
    });
}
exports.postLogin = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    // res.setHeader("Set-Cookie","loggedIn=true; HttpOnly");
    User.findOne({email:email})
    .then(user => {
        if(!user)
        {
            req.flash("key", "danger");
            req.flash("msg", "Invaild Email");
            return res.redirect("/login");
        }
        bcrypt
        .compare(password,user.password)
        .then(doMatch=>{
            if(doMatch)
            {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect("/");
                });
            }
            req.flash("key", "danger");
            req.flash("msg", "Invaild Password");
            res.redirect("/login");
        })
        .catch(err=>{
            console.log(err);
            res.redirect("/login");
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}   
exports.getReset = (req, res, next) => {
   res.render("auth/reset", {
       pageTitle: "Reset Password",
       path: "/reset",
       key: req.flash("key"),
       msg: req.flash("msg")
   });
}
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32,(err,buffer)=>{
    if(err)
    {
        console.log(err);
        return res.redirect("/reset");
    }
    const token=buffer.toString("hex");
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user)
        {
            req.flash("key","warning");
            req.flash("msg","Email Not Found!");
            return res.redirect("/reset");
        }
        user.resetToken=token;
        user.resetTokenExpire = Date.now() + 3600000;
        return user.save();
    })
    .then(result=>{
        req.flash("key", "success");
        req.flash("msg", "Please Check Your mail!");
        res.redirect("/reset");
        return transporter.sendMail({
            to: req.body.email,
            from: "sheponmazumder35@gmail.com",
            subject: "Password Reset",
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
                <p>Thank You</p>
            `
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  });
}
exports.resetPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken:token,resetTokenExpire: {$gt:Date.now()} })
    .then(user=>{
        if(!user)
        {
              req.flash("key", "danger");
              req.flash("msg", "Link Expires!");
            return res.redirect("/reset");
        }
        res.render("auth/reset-password", {
            pageTitle: "Reset Password",
            path: "/reset",
            userId:user._id.toString(),
            token:token,
            key: req.flash("key"),
            msg: req.flash("msg")
        });
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.postResetPassword = (req, res, next) => {
    const userId=req.body.userId;
    const token=req.body.token;
    const password=req.body.password;
    let resetUser;
    User.findOne({_id:userId,resetToken:token,resetTokenExpire: {$gt:Date.now()} })
    .then(user=>{
        if(!user)
        {
              req.flash("key", "danger");
              req.flash("msg", "Link Expires!");
            return res.redirect("/reset");
        }
        resetUser = user;
        return bcrypt.hash(password,12)
    })
    .then(hasPassword=>{
        resetUser.password=hasPassword;
        resetUser.resetToken=null;
        resetUser.resetTokenExpire=null;
        return resetUser.save();
    })
    .then(result=>{
         req.flash("key", "success");
         req.flash("msg", "Your Password Reset Successfully!");
         return res.redirect("/login");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}