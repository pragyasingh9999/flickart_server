const mongoose = require("mongoose");

const Credentials = mongoose.connect("mongodb://localHOST:27017/Credentials",{
     useNewUrlParser : true,
     useUnifiedTopology: true
})


const loginSchema= {
    name: String,
    email: String,
    userID: String,
    password: String,
    repassword: String,
}


const newLogin= mongoose.model("newLogin",loginSchema);



const cartSchema= {
    userID: String,
    items: [Object]
}

const cartItems = mongoose.model("cartItems",cartSchema);

module.exports={newLogin, cartItems}; 