const jwt=require("jsonwebtoken");

const authmiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    console.log(token);
    if(!token){
        return res.status(403).json({authenticated:false});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user=decoded;
        next();
    }
    catch(err){
        return res.status(400).json({ message: "Invalid or expired token" });
    }
}
module.exports = { authmiddleware };