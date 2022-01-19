import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Invalid Email"),
    mobileNumber: string({
      required_error: "Mobile Number is required",
    }).min(10, "Mobile Number must be 10 digits"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short, atleast 6 char long"),
    confirmPassword: string({
      required_error: "Confirm Password is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPasswod"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.confirmPassword"
>;
