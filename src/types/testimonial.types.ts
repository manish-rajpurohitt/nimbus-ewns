export interface TestimonialData {
  _id: string;
  userName: string;
  title: string;
  feedback: string;
  rating: number;
  userLogo?: {
    url: string;
    uploadedAt: string;
  };
  isActive: boolean;
  businessId: string;
  userId: string;
  createdAt: string;
  additionalInfo?: Record<string, unknown>[];
  images?: string[];
  videos?: string[];
}
