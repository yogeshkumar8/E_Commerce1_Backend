const express = require("express");
const router = express.Router();

const {login ,signup,logout} = require("../controller/Auth");
const {auth} = require("../middleware/AuthMiddleware")
router.post("/login",login);
router.post("/signup",signup);

router.get('/logout', auth ,logout);


router.get("/test", (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Routes of Test"
    })
}); 

router.get("/cart",auth, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Routes of cart"
    })
}); 
router.get("/home",auth, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Routes of Home"
    })
}); 


module.exports = router;