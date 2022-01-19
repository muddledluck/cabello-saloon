import { Router } from "express";
import {
  createUserHandler,
  getUserDetailsHandler,
  sendVerificationEmailHandler,
  verifyEmailHandler,
} from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource.middleware";
import { createUserSchema } from "../schema/user.schema";

const UserRoutes = Router();

UserRoutes.post(
  "/create-user",
  validateResource(createUserSchema),
  createUserHandler
);

UserRoutes.get(
  "/send-verificaiton-email",
  requireUser,
  sendVerificationEmailHandler
);

UserRoutes.get("/verify-email", verifyEmailHandler);

/**
 * @openapi
 * '/api/user':
 *  get:
 *     tags: [User]
 *     summary: Get user details
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
UserRoutes.get("/user", requireUser, getUserDetailsHandler);

export default UserRoutes;
