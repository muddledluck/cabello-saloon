import mongoose from "mongoose";

export interface SMTPDocument extends mongoose.Document {
  _id: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  createdAt: Date;
  updatedAt: Date;
}

const smtpSchema = new mongoose.Schema(
  {
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SmtpModel = mongoose.model<SMTPDocument>("smtp", smtpSchema);

export default SmtpModel;
