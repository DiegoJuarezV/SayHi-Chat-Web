import express from "express";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

import "dotenv/config"

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors());
app.use(express.json({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`))
  } catch (error) {
    console.error(`App couldn't be initialized: ${error.message}`);
    process.exit(1);
  }
}

startServer();
