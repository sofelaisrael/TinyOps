declare module "nodemailer" {
  interface SendMailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
  }
  interface SentMessageInfo {
    messageId: string;
    accepted: string[];
    rejected: string[];
    pending: string[];
    response: string;
  }
  interface TransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
  }
  interface Transporter {
    sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
  }
  function createTransport(options: TransportOptions): Transporter;
  function createTransport(host: string, port: number, auth: { user: string; pass: string }): Transporter;
  export { createTransport, SendMailOptions, SentMessageInfo, Transporter, TransportOptions };
  export default { createTransport };
}
