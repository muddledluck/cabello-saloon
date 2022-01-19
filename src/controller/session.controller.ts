import { Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSession,
  updateSession,
} from "../services/session.services";
import { validatePassword } from "../services/user.services";
import { signJwt } from "../utils/jwt";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).json({ msg: "Invalid Email or password" });
  }
  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  // create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTTL") }
  );
  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTTL") }
  );

  if (config.get<string>("nodeEnv") === "production") {
    // set session cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      // Forces to use https in production
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      // Forces to use https in production
      secure: true,
    });
    // return access & refresh token
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res
      .status(200)
      .json({ message: "login successful", accessToken, refreshToken });
  }
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const session = await findSession({ user: userId, valid: true });
  return res.status(200).json({ session });
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(200).json({
    accessToken: null,
    refreshToken: null,
  });
}
