import { logger } from "@/utils";
import { EmailParamsType } from "./emailParams.types";
import { BREVO_API_KEY, EMAIL_SENDER_EMAIL, EMAIL_SENDER_NAME } from "@/config";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";

class EmailService {
  private apiInstance: TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new TransactionalEmailsApi();
    this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
  }

  async sendTransactionalEmail(emailParams: EmailParamsType) {
    let sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = emailParams.subject;
    sendSmtpEmail.htmlContent = emailParams.htmlContent;
    sendSmtpEmail.sender = { name: EMAIL_SENDER_NAME, email: EMAIL_SENDER_EMAIL };
    sendSmtpEmail.to = emailParams.to;
    sendSmtpEmail.headers = { "api-key": `${BREVO_API_KEY}`, "content-type": "application/json", accept: "application/json" };
    sendSmtpEmail.params = emailParams.params;

    try {
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info(`Email sent successfully: ${data.response}`);
    } catch (error) {
      logger.error(`Email failed : ${error.message}`);
      throw error;
    }
  }
}

export { EmailService };
