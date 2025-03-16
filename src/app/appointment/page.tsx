import { fetchBusinessData } from "@/utils/api.utils";
import AppointmentForm from "@/components/Appointment/AppointmentForm";
import { notFound } from "next/navigation";

export default async function AppointmentPage() {
  try {
    const businessRes = await fetchBusinessData();

    if (!businessRes?.isSuccess) {
      notFound();
    }
    return (
      <div>
        {/* Form Section */}
        <div>
          <AppointmentForm
            businessId={businessRes.data.business._id}
            formFields={businessRes.data?.staticData?.appointment?.formFields}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in AppointmentPage:", error);
    notFound();
  }
}
