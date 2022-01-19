import { Request, Response } from "express";
import {
  createSMTP,
  updateSMPT,
} from "../../../services/admin/v1/smtp.services";
import logger from "../../../utils/logger";

export async function editSmtpHandler(req: Request, res: Response) {
  try {
    let result;
    if (!req.body._id) {
      result = await createSMTP(req.body);
    } else {
      result = await updateSMPT(req.body);
    }
    return res.status(200).json({ smtp: result });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}
