import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/session.services";
import { verifyJwt } from "../utils/jwt";
import logger from "../utils/logger";
import config from "config";

const deserializedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken;
  let refreshToken;
  if (config.get<string>("nodeEnv") === "production") {
    const rawCookies = get(req, "headers.cookie", "").split(";");
    const parsedCookies: { [key: string]: string } = {};
    rawCookies.forEach((cookie: string) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        parsedCookies[key.trim()] = value.trim();
      }
    });
    accessToken = parsedCookies.accessToken;
    refreshToken = parsedCookies.refreshToken;
  } else {
    accessToken = get(req, "headers.authorization", "").replace(
      /^Bearer\s/,
      ""
    );
    refreshToken = get(req, "headers.x-refresh", "").replace(/^Bearer\s/, "");
  }
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    logger.info("Generating... new accessToken");
    const newAccessToken = await reIssueAccessToken(refreshToken);
    if (newAccessToken) {
      if (config.get<string>("nodeEnv") === "production") {
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000, // 15 minutes
          // Forces to use https in production
          secure: config.get<string>("nodeEnv") === "production" ? true : false,
        });
      } else {
        res.setHeader("x-access-token", newAccessToken);
      }
      const { decoded } = verifyJwt(newAccessToken);
      res.locals.user = decoded;
    }
  }
  return next();
};

export default deserializedUser;
