import config from "config";
import { Request, Response } from "express";
import { omit } from "lodash";
import {
  createUser,
  findUser,
  sendEmailVerification,
  verifyToken,
} from "../services/user.services";
import logger from "../utils/logger";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    // await sendEmailVerification(user.email);
    return res.status(200).send({ user: omit(user.toJSON(), "password") });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}

export async function sendVerificationEmailHandler(
  req: Request,
  res: Response
) {
  try {
    const userEmail = res.locals.user.email;
    const user = await sendEmailVerification(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Email sent" });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const { token } = req.query as { token: string };
  const isVerified = await verifyToken(token || "");
  const rediredUrl = `${config.get<string>(
    "frontendUrl"
  )}/login?verified=${isVerified}`;
  return res.redirect(rediredUrl);
}

export async function getUserDetailsHandler(req: Request, res: Response) {
  const userId = req.query.userId || res.locals.user._id;
  const user = await findUser({ _id: userId });
  return res.status(200).send({
    user: omit(
      user,
      "password",
      "emailVerificationToken",
      "passwordResetToken"
    ),
  });
}
