import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadRequestException } from "../../exceptions/error.exception.js";

export const userEmailKey = ({ email, subject }) => {
  return `User::${email}::${subject}::OTP`;
};

export const userEmailAttemptsKey = ({ email, subject }) => {
  return `${userEmailKey({ email, subject })}::Attempt`;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    if (!to?.length && !cc?.length && !bcc?.length) {
      throw BadRequestException("Please provide email recipients.");
    }

    if (!text?.length && !html?.length && !attachments?.length) {
      throw BadRequestException("Please provide email content.");
    }

    const info = await transporter.sendMail({
      from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
