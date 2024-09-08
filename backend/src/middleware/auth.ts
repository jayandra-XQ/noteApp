import { RequestHandler } from "express";

export const requiresAuth: RequestHandler = (req,res,next) => {
  if(req.session?.userId) {
    next();
  } else {
    res.status(401).json({message: "User not authenticated"});
  }
}