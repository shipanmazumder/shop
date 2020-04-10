const express = require("express");
const User = require("../models/user");
const expValidator=require("express-validator");
const route = express.Router();
const authController=require("../controllers/auth");
const isAuth= require("../middleware/is-auth");
const { check } = require('express-validator');
route.get("/signup", authController.signup);
route.post("/signup", 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //   throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
            }),
        check(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
        .isLength({ min: 4 }),
        check('cp').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ], authController.postSignup);
route.get("/login", authController.login);
route.post("/login",
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),
        check('password', 'Password has to be valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
    ],authController.postLogin);
route.get("/logout", isAuth, authController.logout);
route.get("/reset", authController.getReset);
route.post("/reset", authController.postReset);
route.get("/reset/:token", authController.resetPassword);
route.post("/resetPassword", authController.postResetPassword);
module.exports=route;