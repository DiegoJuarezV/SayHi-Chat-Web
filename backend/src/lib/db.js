import mongoose from "mongoose";
import dns from "dns";

export async function connectDB() {
  // Forzar DNS solo si la variable de entorno está definida
  const forceDns = process.env.FORCE_DNS;
  if (forceDns) {
    const servers = forceDns.split(',');
    dns.setServers(servers);
    console.log(`🔧 Forcing DNS servers: ${servers.join(', ')}`);
  }

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) throw new Error("MONGO_URI is required");

    const connect = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${connect.connection.host}`);

    } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}