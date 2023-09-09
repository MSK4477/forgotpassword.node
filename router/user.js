import { Router } from "express";
import { v4 } from "uuid";
import User from "../database/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const newUserData = User.find({});
    res
      .status(200)
      .json({ message: "data fetched succesfully", data: newUserData });
  } catch (err) {
    res.status(404).json({ message: "can't fetch the Data", err });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      res.status(409).json({ message: "User already exists" });
      return;
    }
    const newUserData = new User({
      ...req.body,
      id: v4(),
      password: hashedPassword,
    });
    await newUserData.save();
    res
      .status(200)
      .json({ message: "user Registred succesfully", newUserData });
  } catch (err) {
    res.status(404).json({ message: "Failed in Registering The User" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: "Login failed. User not found." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(401)
        .json({ code: 0, message: "Login failed. Invalid password." });
      return;
    }

    res
      .status(200)
      .json({
        message: " User Loggedin successfully",
        id: user.id,
        name: user.name,
        email: user.email,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ks7997067@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});
userRouter.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.json({ code: 0, message: "email not found" });
    return;
  }

  // const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY , {
  //   expiresIn: "1d",
  // });
  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "1d",
  });
  
  const mailOptions = {
    from: "ks7997067@gmail.com",
    to: email,
    subject: "Sample Email Subject",
    text: `https://forgotpassword-node.onrender.com/api/users/resetPassword/${user._id}?token=${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending email.", error });
  }
});
userRouter.post("/resetPassword/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { password } = req.body;

  try {
    jwt.verify(token, "jwt_secret_key");

    const hash = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate({ _id: id }, { password: hash });

    res.json({ Status: "Success" });
  } catch (err) {
    res.json({ Status: "Error with token", Error: err.message });
  }
});

export default userRouter;
