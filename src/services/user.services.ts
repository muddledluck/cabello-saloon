import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import config from "config";
import UserModel, { UserDocument } from "../model/users.model";
import generateSecureRandomToken from "../utils/generateToken";
import logger from "../utils/logger";
import { sendEmail } from "./v1/nodemailer.services";

export async function createUser(
  input: DocumentDefinition<
    Omit<
      UserDocument,
      "comparePassword" | "createdAt" | "updatedAt" | "isVerifiedEmail"
    >
  >
) {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function sendEmailVerification(email: string) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    const emailVerificationToken = generateSecureRandomToken();
    const emailVerificationTokenExpiry = config.get<number>(
      "emailVerificationTokenExpiry"
    );
    user.emailVerificationToken = {
      token: emailVerificationToken,
      expiresAt: new Date(Date.now() + emailVerificationTokenExpiry),
    };
    await user.save();
    const subject = "Email Verification";
    const message = `
    <h3>Please verify your email</h3>
    <p>
      Link is only valid for ${
        emailVerificationTokenExpiry / 60 / 1000
      } minutes.
      <a href="${config.get<string>(
        "baseUrl"
      )}/api/verify-email?token=${emailVerificationToken}">Click here</a> to verify your email.
    </p>
  `;
    await sendEmail({ email: user.email, subject, message });
    return true;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function verifyToken(token: string) {
  const user = await UserModel.findOne({
    "emailVerificationToken.token": token,
    "emailVerificationToken.expiresAt": { $gt: new Date() },
  });
  if (!user) {
    return false;
  }
  user.isVerifiedEmail = true;
  user.emailVerificationToken = {
    token: "",
    expiresAt: new Date(),
  };
  await user.save();
  return true;
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return false;

    const isValid = await user.comparePassword(password);
    if (!isValid) return false;

    return omit(user.toJSON(), "password");
  } catch (error) {
    logger.error(error);
    return false;
  }
}
