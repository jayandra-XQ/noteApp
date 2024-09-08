import { RequestHandler } from "express";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";


export const getAutheticatedUser : RequestHandler = async(req,res) => {

  try {
    const user = await userModel.findById(req.session.userId).select("+email").exec();
    res.status(200).json(user)
  } catch (error) {
    const err = error as Error;
    console.log("Error: " + err.message);
    res.status(500).json({message: "error in get AuthenticatedUser"})
  }
}

interface signUpBody {
  username?: string,
  email?:string,
  password?: string,
}

export const signUp: RequestHandler<unknown, unknown, signUpBody,unknown> = async (req,res) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;


  try {
    if(!username || !email || !passwordRaw) {
      return res.status(400).json({message: "All fields are required"});
    }

    const existingUsername = await userModel.findOne({username: username}).exec()
    if(existingUsername) {
      return res.status(400).json({message: "Username already exists"});
    }

    const existingEmail = await userModel.findOne({email: email}).exec();
    if(existingEmail) {
      return res.status(400).json({message: "Email already exists"});
    }

    const passwordHahed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await userModel.create({username, email, password: passwordHahed});

    //express-session
    req.session.userId = newUser._id;

    res.status(200).json(newUser);
  } catch (error) {
    const err = error as Error;
    console.log("error in signUp controller",err.message);
    res.status(500).json({message: "Server error"});
  }
};

interface LoginBody {
  username?: string,
  password?: string,

}

export const login: RequestHandler<unknown,unknown,LoginBody,unknown> = async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if(!username || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await userModel.findOne({username: username}).select("+password +email").exec();
    if(!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    //express-session
    req.session.userId = user._id;

    res.status(200).json(user);


    
  } catch (error) {
    const err = error as Error;
    console.log("error in login controller",err.message);
    res.status(500).json({message: "Server error"});
  }
}

export const logout: RequestHandler = (req,res) => {
  req.session.destroy(error => {
    if(error){
      console.log("error in logout",error);
      res.status(500).json({message: "Server error"});
    } else {
      res.sendStatus(200)
    }
  });
}