import jwt from "jsonwebtoken";

export const generateToken = (userId, name) => {
  return jwt.sign({ _id: userId, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
};
