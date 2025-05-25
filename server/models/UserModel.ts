import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
});

export const UserModel = mongoose.model("User", UserSchema);
