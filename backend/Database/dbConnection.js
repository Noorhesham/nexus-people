import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log("MongoDB Database Connected");
    })
    .catch((err) => {
      console.log("MongoDB Database Failed To Connect", err);
    });
}
