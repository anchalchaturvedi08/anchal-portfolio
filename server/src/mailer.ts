import nodemailer, { type Transporter } from "nodemailer";
import { config } from "./config";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

/** Visible for testing — builds the mail without sending it. */
export const buildMail = (m: ContactMessage) => ({
  from: `"Portfolio contact form" <${config.smtp.user}>`,
  to: config.smtp.to,
  // Replying in the mail client answers the visitor, not the form.
  replyTo: `"${m.name.replace(/"/g, "")}" <${m.email}>`,
  subject: `New portfolio message from ${m.name}`,
  text: `${m.name} <${m.email}> wrote:\n\n${m.message}\n`,
  html:
    `<p><strong>${escapeHtml(m.name)}</strong> &lt;${escapeHtml(m.email)}&gt; wrote:</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(m.message)}</p>`,
});

let transport: Transporter | null | undefined;

const getTransport = () => {
  if (transport === undefined) {
    // No credentials means the feature is simply off; messages still reach the admin panel.
    transport = config.smtp.user && config.smtp.pass && config.smtp.to
      ? nodemailer.createTransport({
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.port === 465,
          auth: { user: config.smtp.user, pass: config.smtp.pass },
        })
      : null;
  }
  return transport;
};

export const mailConfigured = () => getTransport() !== null;

export const sendContactNotification = async (m: ContactMessage) => {
  const mailer = getTransport();
  if (!mailer) return false;
  await mailer.sendMail(buildMail(m));
  return true;
};

/** Test hook — lets a test swap in a stub transport. */
export const __setTransport = (t: Transporter | null) => {
  transport = t;
};