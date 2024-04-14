export type EmailParamsType = {
  subject: string;
  htmlContent: string;
  to: Array<{
    email: string;
    name?: string;
  }>;
  cc?: Array<{
    email: string;
    name?: string;
  }>;
  bcc?: Array<{
    email: string;
    name?: string;
  }>;
  replyTo?: {
    email: string;
    name?: string;
  };
  headers?: {
    [key: string]: string;
  };
  params?: {
    [key: string]: string | number | boolean;
  };
};
