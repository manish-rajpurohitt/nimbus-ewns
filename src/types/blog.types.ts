export interface BlogData {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  sku: string;
  media?: Array<{ url: string }>;
}

export interface BlogsResponse {
  isSuccess: boolean;
  data: {
    blogs: BlogData[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

export interface BlogDetailsResponse {
  isSuccess: boolean;
  data: BlogData;
}
