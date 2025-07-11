import cloudinary from "../lb/cloudinary.js";
import { generateToken } from "../lb/util.js";
import User from "../modules/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
   const { fullname , email , password , bio }  = req.body;
   

    try {
        if (!fullname || !email || !password ||!bio) {
            return res.json({success: false, message: "All fields are required"});
        }
        const user=await User.findOne({email});

        if(user){
            return res.json({success: false, message: "User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password, salt);
        
        const newUser=await  User.create({
             fullname,
             email,
           password: hashPassword,
            bio
        });

        const token=await generateToken(newUser._id);

        res.json({success: true, userdata: newUser, token, message: "User created successfully"});
        
    } catch (error) {
        console.log(error);
        
        res.json({success: false, message: "Error creating user", error: error.message});
    }
}

export const login = async (req, res) => {
   
    try {
    
         const { email, password } = req.body;
        const user = await User.findOne({ email });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
         
        if(!isPasswordMatch){
            return res.json({success: false, message: "Invalid credentials"});
        }
        const token =  generateToken(user._id);

        res.json({success: true, user, token, message: "User logged in successfully"});
       
        return res.data;
    } catch (error) {
        console.log(error);
        
        res.json({success: false, message: "Error logging in", error: error.message});
    }
}

//controller to check if user is authenticated

export const checkAuth = async (req, res) => {
       res.json({success: true,user:req.user });
}

//controller to update user profile

export const updateProfile = async (req, res) => {
    try {
        const{profilepic, fullname, bio,email} = req.body;
        const userId = req.user._id;

        let updatedUser;

        if(!profilepic){
            await User.findByIdAndUpdate(userId,{bio,fullname},{bio,fullname},{new:true});
        }else{
            const uploadf=await cloudinary.uploader.upload(profilepic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadf.secure_url, fullname, bio}, {new: true});
        }

        res.json({success: true, user: updatedUser});
    } catch (error) {
        console.log(error.message);
          res.json({success: true, user: updatedUser});
        
    }
}