const express=require("express");
require('./db/config');

const User=require('./db/user');
// const Product=require('./db/product');
var smtpTransport = require('nodemailer-smtp-transport');

const app=express();
const Jwt=require("jsonwebtoken");
const jwtKey="products";
const bcrypt=require("bcrypt");
const nodemailer = require('nodemailer');
const cors= require("cors");
app.use(express.json());
app.use(cors());


app.post("/register",async(req,resp)=>{
    try {
      const { name,email, password,role } = req.body
      const existingEmail = await User.findOne({ email })
      const existingUser = await User.findOne({ name })
      if(existingEmail) return resp.status(200).json({success:false,message: "Email already exist" })
      if(existingUser) return resp.status(200).json({success:false, message: "User already exist" })

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpire = new Date();
      const match =0;
     
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'nakarmirohan.test@gmail.com',
            pass: 'hyxqnflfdfigfedx'
        }
    }));
     
    const mailOptions = {
      from: 'youremail@gmail.com',
      to: req.body.email,
      subject: 'OTP Confirmation',
      text: `Your OTP (It is expired after one hour) : ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          resp.status(200).send({
                success:false,
                message: error
            });
         } 
     });


      const user = await User.create({ email, password: hashedPassword,name,role,otp:otp,otpExpire:otpExpire,match:match });
      if(user){
            Jwt.sign({ user },jwtKey,{ expiresIn:"2h" },(err,token)=>{    
            if(err){
                res.status(200).json({success:false, message: "No user found"}) 
            }
            resp.status(200).send({user, token:token, success:true, message: "Successfully Created User"});
            })
         }else{
            res.status(200).json({success:false, message: "No user found"}) 
      }
    }catch (error) {
        resp.status(500).json({success:false, message: "Something went wrong"}) 
    }
});


app.post("/login",async(req,resp)=>{
  try{
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if(!existingUser) return resp.status(200).json({ success:false,message: "User doesn't exist" })
  const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)
  if(!isPasswordCorrect) return resp.status(200).json({success:false,message: "Invalid credentials"})
    const user=existingUser;
    Jwt.sign( { user },jwtKey,{ expiresIn:"2h" },(err,token)=>{    
      if(err){
         resp.status(200).json({success:false,message: err}) 
      }
      resp.status(200).send({success:true,user,message: "SuccessFully Login", token:token}); 
    })
    }catch (error) {
      resp.status(500).json({success:false, message: "Something went wrong"})
  }
})


app.post("/otp",async(req,resp)=>{
  const { email,otp} = req.body;
  let existingUserOtp = await User.findOne({ otp:otp });
    if(existingUserOtp){
    const updatedUserData=await User.findOneAndUpdate( { _id:existingUserOtp._id },{match:1});
    resp.status(200).json({success:true, message: "Successfully Matched Otp",user:updatedUserData });
    }else{
    resp.send('invalid otp');
    }
});

app.post("/forget_password",async(req,resp)=>{
  try{
    const { email} = req.body;
    const existingUser = await User.findOne({ email });
    const otp = Math.floor(1000 + Math.random() * 9000);
    const currentDate= new Date();
        
    if(!existingUser) return resp.status(404).json({success:false,message: "User doesn't exist" })
    // const updateData= await  User.updateOne({ _id:existingUser._id },{$otp:"ss"});
        const updateData=await User.findOneAndUpdate( { _id:existingUser._id },{otp: otp,otpExpire: currentDate });
        var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'nakarmirohan.test@gmail.com',
            pass: 'hyxqnflfdfigfedx'
        }
        }));
        const mailOptions = {
        from: 'youremail@gmail.com',
        to: req.body.email,
        subject: 'Password reset OTP',
        text: `Your OTP (It is expired after one hour) : ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            resp.status(200).send({
                    success:false,
                    message: error
                });
            } else {
                resp.status(200).json({
                    success:true,
                    message: "Your OTP send to the email"
                })
            }
        });
    }catch (error) {
      resp.status(500).json({success:false, message: "Something went wrong"}) 
    }
})

app.post("/recover_password",async(req,resp)=>{
  try{
     const { password,confirm_password,otp } = req.body;
     if(password !==confirm_password) return resp.status(404).json({success:false, message: "Password and confirm_password Donot Matched" })

     const findOtp=await User.findOne({otp:otp})
     if(!findOtp) return resp.status(404).json({success:false,message:"invalid otp"});
      
      let oldDate= new Date(findOtp.otpExpire);
      let current_date = new Date();
      let difference = current_date.getTime() - oldDate.getTime();
      let hoursMilli = 1000 * 60 * 60; // milliseconds * seconds * minutes
      if (Math.abs(difference) < hoursMilli) {  
       const hashedPassword = await bcrypt.hash(password, 12);
       const updateData=await User.findOneAndUpdate( { _id:findOtp._id },{password:hashedPassword});
       return resp.status(200).json({success:true,message:" SuccessFully Changed Password"});
      } else {
       return resp.status(404).json({success:false,message:" otp session expired"});
      }

    }catch (error) {
      resp.status(500).json({success:false, message: "Something went wrong"}) 
  }
})

app.listen(5000);

