import { Router } from "express";
import { editSmtpHandler } from "../../../controller/admin/v1/smtp.controller";
import validateResource from "../../../middleware/validateResource.middleware";
import { editSmtpSchema } from "../../../schema/admin/v1/smtp.schema";

const SMTPRoutes = Router();

SMTPRoutes.post(
  "/edit-smtp",
  validateResource(editSmtpSchema),
  editSmtpHandler
);

export default SMTPRoutes;
