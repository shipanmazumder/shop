const Sequelize = require("sequelize");
const sequelize=require("../util/database");

const CartItem=sequelize.define("cartitem",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    qty:Sequelize.INTEGER
});
module.exports=CartItem;