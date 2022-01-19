import { DocumentDefinition } from "mongoose";
import SmtpModel, { SMTPDocument } from "../../../model/admin/v1/smtp.model";

export async function createSMTP(
  input: DocumentDefinition<
    Omit<SMTPDocument, "createdAt" | "updatedAt" | "_id">
  >
) {
  try {
    const smtp = new SmtpModel(input);
    return await smtp.save();
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateSMPT(input: DocumentDefinition<SMTPDocument>) {
  try {
    const smtp = await SmtpModel.findOneAndUpdate(
      {
        _id: input._id,
      },
      {
        $set: { ...input },
      },
      { new: true }
    );
    return smtp;
  } catch (error: any) {
    throw new Error(error);
  }
}
