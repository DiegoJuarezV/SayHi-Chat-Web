import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.webhook.js"
import authRoutes from "./routers/auth.route.js"
import messageRoutes from "./routers/message.route.js"

import "dotenv/config"

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

// is's important don't parse the webhook event data, keep it raw format
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(cors());
app.use(express.json({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if the public directory exists, serve the static files
// this is for production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      next(err);
    })
  })
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));

    if (process.env.NODE_ENV === "production") job.start();      
  } catch (error) {
    console.error(`App couldn't be initialized: ${error.message}`);
    process.exit(1);
  }
}

startServer();
