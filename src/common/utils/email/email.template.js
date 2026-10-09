import { APPLICATION_NAME } from "../../../config.js";
import { EmailSubjectEnum } from "../../enum/index.js";

export const emailTemplates = {
  [EmailSubjectEnum.CONFIRM_EMAIL]: (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#0e1014;">

  <!-- Preview text shown in the inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#0e1014;">
    Your ${APPLICATION_NAME} code is ${data.code}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0e1014" style="background-color:#0e1014;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">

          <!-- Brand -->
          <tr>
            <td style="padding:0 4px 20px 4px; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; letter-spacing:2px; color:#e8eaed;">
              ${APPLICATION_NAME}
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="#171a21" style="background-color:#171a21; border:1px solid #262b35; border-radius:12px; padding:32px 28px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#f1f3f5; padding-bottom:12px;">
                    ${data.title}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#a8afbb; padding-bottom:24px;">
                    Here's your verification code. Enter it in the app to finish up.
                  </td>
                </tr>

                <!-- Code -->
                <tr>
                  <td align="center" bgcolor="#0e1014" style="background-color:#0e1014; border:1px solid #2a303b; border-radius:10px; padding:22px 12px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:bold; letter-spacing:10px; color:#7dd3a8;">
                      ${data.code}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#8b93a1; padding-top:24px;">
                    If you didn't request this, you can safely ignore this email. Nobody can get into your account without this code.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
           <tr>
            <td style="padding:20px 4px 0 4px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#666d7a;">
              Sent by ${APPLICATION_NAME}. Please don't share this code with anyone.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
  },

  [EmailSubjectEnum.FORGET_PASSWORD]: (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#0e1014;">

  <!-- Preview text shown in the inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#0e1014;">
    Your ${APPLICATION_NAME} password reset code is ${data.code}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0e1014" style="background-color:#0e1014;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">

          <!-- Brand -->
          <tr>
            <td style="padding:0 4px 20px 4px; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; letter-spacing:2px; color:#e8eaed;">
              ${APPLICATION_NAME}
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="#171a21" style="background-color:#171a21; border:1px solid #262b35; border-radius:12px; padding:32px 28px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#f1f3f5; padding-bottom:12px;">
                    ${data.title}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#a8afbb; padding-bottom:24px;">
                    We got a request to reset your password. Use the code below to choose a new one.
                  </td>
                </tr>

                <!-- Code -->
                <tr>
                  <td align="center" bgcolor="#0e1014" style="background-color:#0e1014; border:1px solid #2a303b; border-radius:10px; padding:22px 12px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:bold; letter-spacing:10px; color:#7dd3a8;">
                      ${data.code}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#8b93a1; padding-top:24px;">
                    Didn't ask for this? You can ignore this email and your password will stay exactly as it is.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 4px 0 4px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#666d7a;">
              Sent by ${APPLICATION_NAME}. Never share this code with anyone, not even our team.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
  },

  [EmailSubjectEnum.ENABLE_TWO_FACTOR]: (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#0e1014;">
 
  <!-- Preview text shown in the inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#0e1014;">
    Your ${APPLICATION_NAME} code to enable 2-step verification is ${data.code}
  </div>
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0e1014" style="background-color:#0e1014;">
    <tr>
      <td align="center" style="padding:40px 16px;">
 
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
 
          <!-- Brand -->
          <tr>
            <td style="padding:0 4px 20px 4px; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; letter-spacing:2px; color:#e8eaed;">
              ${APPLICATION_NAME}
            </td>
          </tr>
 
          <!-- Card -->
          <tr>
            <td bgcolor="#171a21" style="background-color:#171a21; border:1px solid #262b35; border-radius:12px; padding:32px 28px;">
 
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#f1f3f5; padding-bottom:12px;">
                    ${data.title}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#a8afbb; padding-bottom:24px;">
                    You're turning on 2-step verification. Enter the code below in the app to confirm and add an extra layer of protection to your account.
                  </td>
                </tr>
 
                <!-- Code -->
                <tr>
                  <td align="center" bgcolor="#0e1014" style="background-color:#0e1014; border:1px solid #2a303b; border-radius:10px; padding:22px 12px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:bold; letter-spacing:10px; color:#7dd3a8;">
                      ${data.code}
                    </span>
                  </td>
                </tr>
 
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#8b93a1; padding-top:24px;">
                    Didn't try to enable this? You can ignore this email and 2-step verification will stay off. If you're worried about your account, consider changing your password.
                  </td>
                </tr>
              </table>
 
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td style="padding:20px 4px 0 4px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#666d7a;">
              Sent by ${APPLICATION_NAME}. Never share this code with anyone, not even our team.
            </td>
          </tr>
 
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>`;
  },
 
  [EmailSubjectEnum.LOGIN_TWO_FACTOR]: (data) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${data.title}</title>
</head>
<body style="margin:0; padding:0; background-color:#0e1014;">
 
  <!-- Preview text shown in the inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#0e1014;">
    Your ${APPLICATION_NAME} login code is ${data.code}
  </div>
 
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0e1014" style="background-color:#0e1014;">
    <tr>
      <td align="center" style="padding:40px 16px;">
 
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
 
          <!-- Brand -->
          <tr>
            <td style="padding:0 4px 20px 4px; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; letter-spacing:2px; color:#e8eaed;">
              ${APPLICATION_NAME}
            </td>
          </tr>
 
          <!-- Card -->
          <tr>
            <td bgcolor="#171a21" style="background-color:#171a21; border:1px solid #262b35; border-radius:12px; padding:32px 28px;">
 
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; color:#f1f3f5; padding-bottom:12px;">
                    ${data.title}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#a8afbb; padding-bottom:24px;">
                    Someone is signing in to your account. Enter this code to complete your login.
                  </td>
                </tr>
 
                <!-- Code -->
                <tr>
                  <td align="center" bgcolor="#0e1014" style="background-color:#0e1014; border:1px solid #2a303b; border-radius:10px; padding:22px 12px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:bold; letter-spacing:10px; color:#7dd3a8;">
                      ${data.code}
                    </span>
                  </td>
                </tr>
 
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#8b93a1; padding-top:24px;">
                    Wasn't you? Someone may know your password. Don't share this code, and change your password as soon as you can.
                  </td>
                </tr>
              </table>
 
            </td>
          </tr>
 
          <!-- Footer -->
          <tr>
            <td style="padding:20px 4px 0 4px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#666d7a;">
              Sent by ${APPLICATION_NAME}. ${APPLICATION_NAME} will never ask you for this code.
            </td>
          </tr>
 
        </table>
 
      </td>
    </tr>
  </table>
 
</body>
</html>`;
  },
};

export const sentEmailTemplate = (data) => {
  return emailTemplates[data.subject](data);
};
