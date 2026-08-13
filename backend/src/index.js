import express from "express"
import "dotenv/config"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`))
  } catch (error) {
    console.error(`No se pudo iniciar la app: ${error.message}`);
    process.exit(1);
  }
}

startServer();
