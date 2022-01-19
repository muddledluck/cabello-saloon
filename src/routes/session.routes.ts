import { Router } from "express";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionHandler,
} from "../controller/session.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource.middleware";
import { createSessionSchema } from "../schema/session.schema";

const SessionRoutes = Router();

SessionRoutes.post(
  "/sessions",
  validateResource(createSessionSchema),
  createUserSessionHandler
);

SessionRoutes.get("/sessions", requireUser, getUserSessionHandler);
SessionRoutes.delete("/sessions", requireUser, deleteUserSessionHandler);

export default SessionRoutes;
