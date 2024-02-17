import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({ msg: "OK", users });
  }
  catch (error) {
    res.status(200).json({
      msg: "ERROR", Cause: error
    })
  }
}