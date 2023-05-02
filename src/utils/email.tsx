import emailjs from "@emailjs/browser";

// EmailJS configuration
const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const userID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || "";

export const sendEmailJS = async (data: Record<string, unknown>) => {
  const response = await emailjs.send(serviceID, templateID, data, userID);
  return response;
};
