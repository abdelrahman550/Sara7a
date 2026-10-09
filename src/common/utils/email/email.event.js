import { EventEmitter } from "node:events";
import { sentEmailTemplate } from "./email.template.js";
import { sendEmail } from "./index.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async ({ recipients, subject, data }) => {
  try {
    await sendEmail({
      ...recipients,
      subject,
      html: sentEmailTemplate({
        code: data.code,
        subject,
        title: data.title ?? subject,
      }),
    });
  } catch (error) {
    console.log(error);
  }
});
