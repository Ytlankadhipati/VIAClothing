import mongoose from "mongoose";

let isMemoryDb = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/via_clothing";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(
      `[Database] External MongoDB connection failed (${err.message}).`
    );

    // mongodb-memory-server is a devDependency — it will NOT be installed in production.
    // Attempt a dynamic import; if the package is absent (production deploy), log a clear
    // error and re-throw the original connection error so the process exits.
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      console.warn(
        "[Database] Initializing In-Memory Mongo instance for zero-config local development..."
      );
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      isMemoryDb = true;
      console.log(`[Database] In-Memory MongoDB running at: ${memUri}`);
      return conn;
    } catch (memErr) {
      if (
        memErr.code === "ERR_MODULE_NOT_FOUND" ||
        memErr.message?.includes("Cannot find")
      ) {
        // Package not installed (expected in production)
        console.error(
          "[Database] FATAL: Could not connect to MongoDB and the in-memory fallback " +
            "(mongodb-memory-server) is not available in this environment.\n" +
            "          Set the MONGO_URI environment variable to a valid MongoDB connection string."
        );
      } else {
        console.error(
          `[Database] Failed to initialize in-memory MongoDB: ${memErr.message}`
        );
      }
      // Re-throw original connection error so the calling code (server.js) can exit
      throw err;
    }
  }
};

export const getIsMemoryDb = () => isMemoryDb;
