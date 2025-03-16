import ServiceDetails from "@/components/ServiceDetails";
import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";

async function getServiceDetails(id: string) {
  try {
    const response = await api.business.getServiceDetails(id);
    if (!response.isSuccess) {
      throw new Error("Failed to fetch service details");
    }
    return response.data;
  } catch (error) {
    console.error("Error in getServiceDetails:", error);
    return null;
  }
}

export default async function ServicePage({
  params
}:any) {
  try {
    const [businessRes, serviceData] :any = await Promise.all([
      fetchBusinessData(),
      getServiceDetails(params.id)
    ]);

    if (!serviceData || !businessRes?.data) {
      return (
        <div className="details__loading">
          <p className="text-gray-600">Service not found</p>
        </div>
      );
    }

    return (
      <ServiceDetails
        businessData={businessRes.data}
        serviceData={serviceData}
      />
    );
  } catch (error) {
    console.error("Error loading service:", error);
    return (
      <div className="details__error">
        <p>Failed to load service details. Please try again later.</p>
      </div>
    );
  }
}
