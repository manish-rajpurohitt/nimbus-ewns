import { api } from "@/lib/api";

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
  return (
    <div className="contact-form-container">
      <form
        action={async (formData: FormData) : Promise<any> => {
          "use server";
          try {
            const data = {
              name: formData.get("name") as string,
              email: formData.get("email") as string,
              phone: formData.get("phone") as string,
              subject: formData.get("subject") as string,
              message: formData.get("message") as string,
              isNewsLetterSubscribed:
                formData.get("isNewsletterSubscribed") === "on",
              businessId
            };
            return await api.business.sendContactMessage(data);
          } catch (error) {
            return { isSuccess: false, message: "Failed to send message" };
          }
        }}
        className="contact-form"
      >
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

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
    </div>
  );
}
