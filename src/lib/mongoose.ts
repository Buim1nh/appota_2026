import mongoose from "mongoose";

// Extend the global object with cached connection
declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize cache if not already done
if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

function getMongoUri() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  return MONGODB_URI;
}

/**
 * Mongoose connection utility with caching for serverless environments.
 * Prevents multiple connection instances in Next.js serverless functions.
 */
export async function connectMongoDB() {
  const mongoUri = getMongoUri();

  // Return cached connection if already connected
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn;
  }

  // Return promise if connection is in progress
  if (global.mongooseConnection.promise) {
    global.mongooseConnection.conn = await global.mongooseConnection.promise;
    return global.mongooseConnection.conn;
  }

  // Create new connection promise
  global.mongooseConnection.promise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  try {
    global.mongooseConnection.conn =
      await global.mongooseConnection.promise;
    console.log("✓ MongoDB connected");
    return global.mongooseConnection.conn;
  } catch (error) {
    global.mongooseConnection.promise = null;
    throw error;
  }
}
