import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze";

const app = express();

// Use PORT from .env or fallback to 5000
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Middleware
app.use(cors());
app.use(express.json());  

// Routes
app.use("/api/analyze", analyzeRouter);

// Default test route
app.get("/", (_req, res) => {
  res.send("L∞plyt backend is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 