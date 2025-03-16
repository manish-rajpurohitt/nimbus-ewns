import { api } from "@/lib/api";

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

const defaultFormFields: FormField[] = [
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "John Doe",
    required: true
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "example@email.com",
    required: true
  },
  {
    name: "phone",
    type: "tel",
    label: "Phone",
    placeholder: "Your phone number",
    required: false
  },
  {
    name: "subject",
    type: "text",
    label: "Subject",
    placeholder: "Enter subject",
    required: false
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    placeholder: "Enter your message for us",
    required: false
  }
];

export default function AppointmentForm({
  businessId,
  formFields = defaultFormFields
}: {
  businessId: string;
  formFields?: FormField[];
}) {
  async function handleSubmit(formData: FormData):Promise<any> {
    "use server";
    try {
      const data: any = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        isNewsletterSubscribed: formData.get("isNewsletterSubscribed") === "on",
        businessId
      };

      if (!data.name?.trim()) {
        return { error: "Please enter your name" };
      }
      if (!data.email?.trim()) {
        return { error: "Please enter your email" };
      }
      if (!data.message?.trim()) {
        return { error: "Please enter a message" };
      }

      const response = await api.business.sendContactMessage(data);
      return response;
    } catch (error) {
      return { isSuccess: false, message: "Failed to send message" };
    }
  }

  return (
    <div className="main-page-container" id="appointment-page">
      <div className="appointment-page-container">
        <div className="form-card">
          <div className="appointment-title-container">
            <div className="section-subtitle">APPOINTMENT</div>
            <h2 className="appointment-title">Consult with Our Experts</h2>
          </div>

          <form action={handleSubmit} className="appointment-form">
            {formFields.map((field, index) => (
              <div key={index} className="appointment-row">
                <label htmlFor={field.name} className="appointment-label">
                  {field.label}{" "}
                  {field.required && <span className="required">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="appointment-textarea"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="appointment-input"
                  />
                )}
              </div>
            ))}

            <div className="newsletter-subscription">
              <input
                type="checkbox"
                id="isNewsletterSubscribed"
                name="isNewsletterSubscribed"
                className="checkbox-input"
              />
              <label htmlFor="isNewsletterSubscribed">
                Subscribe to our newsletter
              </label>
            </div>

            <button type="submit" className="appointment-submit-button">
              Book Appointment Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
