import mongoose from "mongoose";
const { Schema } = mongoose;

// TODO : schema for user
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Student"],
      enum: ["Student", "Tutor", "Admin"],
    },
    // TODO: remove if I do not implement the payment system
    passwordResetCode: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
