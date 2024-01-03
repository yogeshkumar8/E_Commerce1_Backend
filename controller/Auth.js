const bcrypt = require("bcrypt");
const User = require("../model/user");
require("dotenv").config();
const jwt = require("jsonwebtoken")


exports.signup = async (req,res) =>{
    try{
        //get data
        const{username,email,password} = req.body;
        //check user if already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message:'User already Exist',
            });
        }
        
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);   
        }
        catch(err){
            res.status(500).json({
                success: false,
                message: "error in hashing password"
            });
        }

        //create entry for user
        const user = await User.create({
            username,email,password:hashedPassword
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully"
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'user cannot register,please try again later',
            error: err,
        })
    }
}


exports.login = async (req,res) => {

    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill detatils carefully ",
            });
        }
        
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not register",
            });
        }
        
        const payload = {
            email: user.email,
            id: user._id,
            role:user.role,
        }
        if(await bcrypt.compare(password, user.password)){
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: "2h",
                                });

            user = user.toObject();
            user.token = token;
            console.log(user);
            user.password = undefined;
            // console.log(user);

            const options = {
                expires: new Date(Date.now() + 100000), // * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message: "User Logged in SuccessFully"
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            });
        }
    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Faliure",
        })
    }

}



exports.logout = (req, res) => {
    // Clear the token on the server-side (by not sending it in the response)
    res.clearCookie("token").status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};