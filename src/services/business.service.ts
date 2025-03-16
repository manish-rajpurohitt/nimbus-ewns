import { api } from "@/lib/api";
import type { Business, StaticData } from "@/types/business.types";

export interface BusinessResponse {
  isSuccess: boolean;
  data: {
    business: Business;
    staticData: StaticData;
    navbar?: any;
  };
}

export const BusinessService = {
  async getBusinessDetails() {
    const response = await api.business.getDetails();
    return response.data;
  },

  async getBusinessAddress() {
    const response = await api.business.getAddress();
    return response.data;
  }
};
