// lib/sendEmailNotification.ts
import emailjs from "@emailjs/browser";

export const sendEmailNotification = async ({
  toEmail,
  clientname,
  formtype,
  status,
}) => {
  const templateParams = {
    to_email: toEmail,
    clientname,
    formtype,
    status,
  };

  try {
    const result = await emailjs.send(
     process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
    console.log("Email sent successfully", result.status);
  } catch (error) {
    console.error("Email sending failed", error);
  }
};
