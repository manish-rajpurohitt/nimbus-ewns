"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { submitContactForm } from "@/actions/form.actions";
import {
  showSuccessMessage,
  showErrorMessage
} from "@/utils/notification.utils";

interface ContactFormProps {
  businessId: string;
  staticData?: {
    title?: string;
    subtitle?: string;
  };
}

export default function ContactForm({
  businessId,
  staticData
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // console.log("Form submission started"); // Debug log

      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        isNewsletterSubscribed: formData.get("isNewsletterSubscribed") === "on",
        businessId
      };

      // Client-side validation
      if (!data.name?.trim()) {
        toast.error("Please enter your name");
        return;
      }
      if (!data.email?.trim()) {
        toast.error("Please enter your email");
        return;
      }
      if (!data.message?.trim()) {
        toast.error("Please enter a message");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // console.log("Submitting form data:", data); // Debug log
      const response = await submitContactForm(data);
      // console.log("Form submission response:", response); // Debug log

      if (response?.isSuccess) {
        toast.success("Thank you! Your message has been sent successfully.", {
          duration: 5000,
          position: "top-center"
        });
        formRef.current?.reset();
      } else {
        toast.error(
          response?.message || "Failed to send message. Please try again.",
          {
            duration: 5000,
            position: "top-center"
          }
        );
      }
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      toast.error("An error occurred. Please try again later.", {
        duration: 5000,
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <form ref={formRef} action={handleSubmit} className="contact-form">
        <div className="contact-form-heading">
          <h2 className="contact-form-title">
            {staticData?.title || "Let's Start a Conversation"}
          </h2>
          <p className="contact-form-subtitle">
            {staticData?.subtitle ||
              "We'd love to hear from you. Send us a message!"}
          </p>
        </div>

        <div className="form-fields-container">
          <div className="form-field">
            <input type="text" id="name" name="name" placeholder=" " required />
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
          </div>

          <div className="form-field">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
            />
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
          </div>

          <div className="form-field">
            <input type="tel" id="phone" name="phone" placeholder=" " />
            <label htmlFor="phone">Phone Number</label>
          </div>

          <div className="form-field">
            <input type="text" id="subject" name="subject" placeholder=" " />
            <label htmlFor="subject">Subject</label>
          </div>

          <div className="form-field">
            <textarea
              id="message"
              name="message"
              placeholder=" "
              required
              rows={5}
            ></textarea>
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
          </div>

          <div className="newsletter-subscription">
            <input
              type="checkbox"
              id="isNewsletterSubscribed"
              name="isNewsletterSubscribed"
              className="checkbox-input"
            />
            <label htmlFor="isNewsletterSubscribed">
              Subscribe to our newsletter to receive updates
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
