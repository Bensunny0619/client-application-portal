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
      "your_service_id",      // from EmailJS
      "your_template_id",     // from EmailJS
      templateParams,
      "your_public_key"       // from EmailJS
    );
    console.log("Email sent successfully", result.status);
  } catch (error) {
    console.error("Email sending failed", error);
  }
};
