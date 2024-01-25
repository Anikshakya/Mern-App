const moongose=require("mongoose");

const userSchema= new moongose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    otp:String,
    otpExpire:String,
    match:String
});

module.exports= moongose.model("users",userSchema);