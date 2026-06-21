import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Trust Railway proxy
app.set("trust proxy", 1);

// CORS config
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://looplyt.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send("L∞plyt backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});