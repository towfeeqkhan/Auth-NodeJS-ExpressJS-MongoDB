import bcrypt from "bcrypt";
import { z } from "zod";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { formatZodError } from "../utils/zodError.helper.js";
import { signupSchema } from "../validators/user.validator.js";

export const registerUser = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      console.log(z.prettifyError(validation.error));

      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(validation.error),
      });
    }

    const { name, email, password, role } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(newUser._id, newUser.name);

    res.status(201).json({
      message: "User created successfully",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.name);

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
