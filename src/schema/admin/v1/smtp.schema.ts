import { number, object, string } from "zod";

export const editSmtpSchema = object({
  body: object({
    host: string({
      required_error: "Host is required",
    }),
    port: number({
      required_error: "Port is required",
    }),
    user: string({
      required_error: "User is required",
    }),
    pass: string({ required_error: "Passord is required" }),
  }),
});
