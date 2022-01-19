import nodemailer from "nodemailer";
import SmtpModel from "../../model/admin/v1/smtp.model";

interface SendEmailInterface {
  email: string;
  subject: string;
  message: string;
}

export async function sendEmail({
  email,
  subject,
  message,
}: SendEmailInterface) {
  const smtpDetails = await SmtpModel.findOne({});
  const hostname = smtpDetails?.host;
  const username = smtpDetails?.user;
  const password = smtpDetails?.pass;
  const port = smtpDetails?.port;

  const transporter = nodemailer.createTransport({
    host: hostname,
    port: port,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  await transporter.sendMail(
    {
      from: `Cabello cabellosaloon128@gmail.com`,
      to: email,
      subject,
      html: message,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    }
  );
}
