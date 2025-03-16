export interface Business {
  id: string;
  businessName?: string;
  logoURl?: string;
  shortBio?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  showServices: boolean;
  showBlogs: boolean;
  showProducts: boolean;
  showAlbums: boolean;
  showTeams: boolean;
  enableUserLogin: boolean;
  enableEcommerce: boolean;
  enableOrders: boolean;
  externalLinks?: Array<{
    _id: string;
    platform: string;
    url: string;
    logo?: string;
  }>;
}

export interface BusinessAddress {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  email: string;
}

export interface StaticData {
  navbar: {
    heading?: string;
  };
  phone?: string[];
  email?: string[];
  home?: {
    appointment?: AppointmentSection;
  };
}

export interface BannerData {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export interface BusinessData {
  businessName?: string;
  bannerUrl?: string;
}

export interface BusinessResponse {
  isSuccess: boolean;
  data: {
    business: {
      businessData: BusinessData;
      staticData: {
        home?: {
          banner?: BannerData;
        };
      };
    };
  };
}

export interface ExternalLink {
  _id: string;
  platform: string;
  url: string;
  logo?: string;
}

export interface FooterConfig {
  backgroundImage?: string;
  subscription?: {
    title?: string;
    description?: string;
    buttonText?: string;
  };
}

export interface AppointmentSection {
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
}
