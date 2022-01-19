import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

type token = {
  token: string;
  expiresAt: Date;
};
export interface UserDocument extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  bio: string;
  profileImage: string;
  username: string;
  followers: string[];
  isVerifiedEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailVerificationToken: token;
  passwordResetToken: token;
  comparePassword(confirmPassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    // verifaction
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: {
        token: String,
        expiresAt: Date,
      },
      default: { token: "", expiresAt: "" },
    },
    passwordResetToken: {
      type: {
        token: String,
        expiresAt: Date,
      },
      default: { token: "", expiresAt: "" },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  confirmPassword: string
): Promise<Boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(confirmPassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
