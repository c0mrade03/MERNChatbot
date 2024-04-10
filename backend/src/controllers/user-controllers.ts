import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

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
    res.status(400).json({
      msg: "ERROR", Cause: error
    })
  }
}

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    })

    if (!user) {
      return res.json(401).json({
        error: "user not found"
      })
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({
        error: "incorrect password"
      })
    }

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    res.status(201).json({ message: "OK", name: user.name, email: user.email });
  }
  catch (error) {
    res.status(400).json({
      msg: "ERROR", Cause: error
    })
  }
}

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({
      email
    })

    if (existingUser) {
      return res.status(401).json({
        error: "User with this name already exists"
      })
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword
    })
    await user.save();

    // Create token and store cookie
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    res.status(201).json({ message: "OK", name: user.name, email: user.email });
  }
  catch (error) {
    res.status(400).json({
      msg: "ERROR", Cause: error
    })
  }
}