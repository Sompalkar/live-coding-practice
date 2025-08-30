import type { Request, Response } from "express";
import User from "../models/user.mode.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

export const registerUser = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body;

  console.log(req.body);

  try { 




    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "User already exists with this email. Try to login.",
        data: email,
      });
    } 




    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken. Please choose another username.",
        data: username,
      });
    }
 
    const hashedPassword = await bcrypt.hash(password, 5);

 
    const registeredUser = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
    });
 




    const token = jwt.sign(
      { _id: registeredUser._id, email: registeredUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
 
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,  
    });
 



    const { password: _, ...userWithoutPassword } = registeredUser.toObject();

    return res.status(201).json({
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "User registration failed",
      error: error,
    });
  }
};



export const loginUser = async ( req:Request , res:Response)=>{


    const { email, password} = req.body;

    console.log(email, password);

    try {
        
        const response = await User.findOne({email:email})

        if(!response){
            return res.status(400).json({
                message: "User not found. Please register first.",
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, response.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Password is wrong try again!!",
            })
        }

        const token = jwt.sign({_id: response._id, email: response.email}, process.env.JWT_SECRET as string, {expiresIn: "24h"})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        const {password: _, ...userWithoutPassword} = response.toObject();

        return res.status(200).json({
            message: "User logged in successfully",
            data: userWithoutPassword,
        })

    } catch (error) {
        return res.status(500).json({
            message: "User login failed",
            error: error,
        })
    }








}




export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Token is missing, please login again.",
        isAuthenticated: false,
      });
    }

     
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

   
    const response = await User.findById(decoded._id);

    if (!response) {
      return res.status(404).json({
        message: "User not found.",
        isAuthenticated: false,
      });
    }

   
    const { password, ...userWithoutPassword } = response.toObject();

    return res.status(200).json({
      message: "User verified successfully.",
      data: userWithoutPassword,
      isAuthenticated: true,
    });
  } catch (error) {

    console.error("Error verifying user:", error);
    return res.status(401).json({
      message: "Invalid or expired token.",
      isAuthenticated: false,
    });


  }
};




export const logoutUser = async (req: Request, res: Response) => {
    try {
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "User logged out successfully",
            isAuthenticated: false
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Logout failed",
            error: error
        });
    }
}

