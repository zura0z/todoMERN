import asyncHandler from "express-async-handler";

import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!username || !email || !password) {
    res.status(400).send({ message: "Please fill out every field" });
    throw new Error("Please fill out every field");
  }
  if (userExists) {
    res.status(400).send({ message: "User already exists" });
    throw new Error("User already exists");
  }
  if (!/^[a-zA-Z0-9_.]+$/.exec(username)) {
    res
      .status(400)
      .send({ message: "Your username contains illegal characters" });
    throw new Error("Your username contains illegal characters");
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(400).send({ message: "Email is invalid" });
    throw new Error("Email is invalid");
  }

  try {
    const user = await User.create({
      username,
      email,
      password,
      image: "/images/user-icon.png",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid user data", error });
    throw new Error("Invalid user data");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json({ message: "Incorrect email or password" });
    throw new Error("Incorrect email or password");
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { username, password, image } = req.body;

    if (!/^[a-zA-Z0-9_.]+$/.exec(username)) {
      res
        .status(400)
        .send({ message: "Your username contains illegal characters" });
      throw new Error("Your username contains illegal characters");
    }

    user.username = username || user.username;
    user.image = image || user.image;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      image: updatedUser.image,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
