const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

 const register=async(req,res)=>{
    try{
        const{fullname,email,password,confirmPassword}=req.body;
        if(!fullname||!email||!password||!confirmPassword){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        if(password!=confirmPassword){
            return res.status(400).json({
                message:"password does not match with confirm password"
            });
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"email exist"
            });
        }
        
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            fullname,email,
            password:hashedPassword,
        })
        return res.status(201).json({
            message:"user registered succesfully"
        });
    }
    catch(err){
        console.log(err);
    }
}
 const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            });
        }
        
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"email does not exist",
                success:false
            });
        }
        
        const isPassword=await bcrypt.compare(password,user.password);
        if(!isPassword){
            return res.status(400).json({
                messgae:"password incorrect",
                success:false
            });
        }
        
        const tokenData={
            userId:user._id
        };

        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        return res.status(200).cookie("token",token,{maxAge:24*60*60*1000,httpOnly:true,sameSite:'None', secure: true,}).json({
            _id:user._id,
            email:user.email,
            fullname:user.fullname,
            message:"user login succesfully"
        });
    }
    catch(err){
        console.log(err);
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
        });
        return res.status(200).json({
            message: "log out successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Logout failed"
        });
    }
};

module.exports = { register, login, logout };