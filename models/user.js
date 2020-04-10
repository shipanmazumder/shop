const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpire:Date,
    cart:{
        items:[
            {
                productId:{
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required:true
                },
                qty:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
});
userSchema.methods.addToCart=function(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString();
    });
    let newQty=1;
    const updateCartItems=[...this.cart.items];
    if (cartProductIndex>=0)
    {
        newQty = this.cart.items[cartProductIndex].qty+1;
        updateCartItems[cartProductIndex].qty = newQty;
    }else{
        updateCartItems.push({
            productId:product._id,
            qty:newQty
        });
    }
    const updatedCart={
        items: updateCartItems
    };
    this.cart=updatedCart;
    return this.save();
}
userSchema.methods.deleteCart=function(productId){
    const updateCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString();
    })
    this.cart.items=updateCartItems;
    return this.save();
}
userSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save();
}
module.exports=mongoose.model("User",userSchema);