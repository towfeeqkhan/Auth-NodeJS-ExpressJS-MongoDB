import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { z } from "zod";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { formatZodError } from "../utils/zodError.helper.js";
import { loginSchema, signupSchema } from "../validators/user.validator.js";

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const { accessToken, refreshToken } = generateToken(
      newUser._id,
      newUser.name,
      newUser.role,
    );

    const newHashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    newUser.refreshToken = newHashedRefreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_KEY_EXPIRES_IN || "7d"), // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      console.log(z.prettifyError(validation.error));

      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(validation.error),
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateToken(
      user._id,
      user.name,
      user.role,
    );

    const newHashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    user.refreshToken = newHashedRefreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_KEY_EXPIRES_IN || "7d"), // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyUser = async (req, res) => {
  res.status(200).json({ message: "User is verified", user: req.user });
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    //  Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Find user
    const user = await User.findById(decoded._id);

    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: "User not found" });
    }

    // Compare hashed refresh token
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    // ROTATE TOKENS
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user._id,
      user.name,
      user.role,
    );

    // Hash new refresh token
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 12);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    // Send new refresh cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_KEY_EXPIRES_IN || "7d"),
    });

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(204).json({ message: "No active session" });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    } catch {
      return res.status(204).json({ message: "Already logged out" });
    }

    const user = await User.findById(decoded._id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
