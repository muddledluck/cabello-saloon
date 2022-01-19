import mongoose from "mongoose";
import { UserDocument } from "./users.model";

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: Boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
