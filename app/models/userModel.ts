import { Schema, Document, model, models, Model } from "mongoose";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: { url: string; id: string };
  verified: boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: Object, url: String, id: String },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model("User", userSchema);
export default UserModel as Model<UserDocument>;
