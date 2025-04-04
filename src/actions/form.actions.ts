"use server";

import { api } from "@/lib/api";

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isNewsletterSubscribed: boolean;
  businessId: string;
}) {
  console.log("Server Action - Submitting form:", data); // Debug log

  try {
    const response = await api.business.sendContactMessage(data);
    console.log("Server Action - API response:", response); // Debug log

    return {
      isSuccess: Boolean(response?.isSuccess),
      message:
        response?.message ||
        (response?.isSuccess
          ? "Message sent successfully!"
          : "Failed to send message")
    };
  } catch (error) {
    console.error("Server Action - Error:", error); // Debug log
    return {
      isSuccess: false,
      message: "Failed to send message. Please try again."
    };
  }
}
