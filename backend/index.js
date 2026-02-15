import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.route.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";

await connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
