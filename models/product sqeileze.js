const Sequelize = require("sequelize");
const sequelize=require("../util/database");

const Product=sequelize.define("product",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    title:Sequelize.STRING,
    price:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    imgUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:true
    }
});
module.exports=Product;