import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user.model.js";
import { formatZodError } from "../utils/zodError.helper.js";
import { signupSchema } from "../validators/user.validator.js";

export const createUser = async (req, res) => {
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

    const token = jwt.sign(
      { _id: newUser._id, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

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
