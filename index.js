import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";

await connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
