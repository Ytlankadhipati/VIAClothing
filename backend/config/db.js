import mongoose from "mongoose";

let isMemoryDb = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/via_clothing";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] External MongoDB connection failed (${err.message}). Initializing In-Memory Mongo instance for zero-config local development...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      isMemoryDb = true;
      console.log(`[Database] In-Memory MongoDB running at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] Failed to initialize in-memory MongoDB: ${memErr.message}`);
      throw memErr;
    }
  }
};

export const getIsMemoryDb = () => isMemoryDb;
