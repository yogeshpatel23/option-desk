import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI)
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );

// get global mongoose vriable
let cached = global.mongoose;

// if not vaiable creatre new
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // if connection exiest return conn
  if (cached.conn) return cached.conn;

  // if connection promis is null create new connection
  if (!cached.promise) {
    mongoose
      .connect(MONGODB_URI, {
        dbName: "optiondesk",
      })
      .then(
        (mongoose) => mongoose,
        (err) => console.log(`Mongo Conn Err :: ${err}`)
      );
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
