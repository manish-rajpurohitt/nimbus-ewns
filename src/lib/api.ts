import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { headers } from "next/headers"
// Base URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.ewns.in/api";
// "http://localhost:9000/api";

// Visitor token handling
async function getVisitorToken(domainName: any) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/website/getVisitorToken?domainName=${domainName}`
    );
    if (res.data.isSuccess && res.data?.data?.token) {
      return res.data.data.token;
    }
  } catch (error) {
    // console.log(error)
    console.error("Error getting visitor token:", error);
  }
  return null;
}

const getServerHostname = async () => {
  const headersList = await headers();
  const host = headersList.get("host"); // This returns hostname with optional port
  // return host;
  return "icontechpro.ewns.in";
};

// Add custom error type
interface ApiError extends Error {
  status?: number;
  response?: any;
}

// Add retry config
const RETRY_CONFIG = {
  maxRetries: 2,
  delayMs: 1000
};

// Update fetchApi with better error handling
async function fetchApi<T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  retryCount = 0
): Promise<any> {
  try {
    // console.log(method, url, data, config);
    // return;
    const client = await createApiClient();

    const headers: any = {
      ...client.defaults.headers,
      ...(config?.headers || {})
    };

    // console.log(`Making ${method} request to:`, {
    //   url,
    //   method,
    //   data,
    //   headers
    // });

    let response;
    switch (method) {
      case "GET":
        response = await client.get(url, { ...config, headers });
        break;
      case "PUT":
        response = await client.put(url, data, { ...config, headers });
        break;
      default:
        response = await client.post(url, data, { ...config, headers });
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear existing token
      if (typeof window !== "undefined") {
        localStorage.removeItem("_t");
      }

      // Retry logic for 401 errors
      if (retryCount < RETRY_CONFIG.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_CONFIG.delayMs)
        );

        // Try to get a new token
        const hostname =
          typeof window !== "undefined"
            ? window.location.hostname
            : getServerHostname();
        const newToken = await getVisitorToken(hostname);

        if (newToken) {
          return fetchApi<T>(method, url, data, config, retryCount + 1);
        }
      }
    }

    const apiError: ApiError = new Error("API request failed");
    apiError.status = axios.isAxiosError(error) ? error.response?.status : 500;
    apiError.response = axios.isAxiosError(error) ? error.response?.data : null;

    // console.error(`API ${method} error:`, {
    //   url,
    //   status: apiError.status,
    //   message: apiError.message,
    //   response: apiError.response
    // });

    // Add specific handling for cart operations
    if (url.includes("/cart")) {
      // console.error("Cart operation failed:", {
      //   method,
      //   url,
      //   error: axios.isAxiosError(error)
      //     ? {
      //       status: error.response?.status,
      //       data: error.response?.data,
      //       message: error.message
      //     }
      //     : error
      // });
    }

    return {
      isSuccess: false,
      message: apiError.response?.message || "An unexpected error occurred",
      error: {
        status: apiError.status,
        message: apiError.message
      }
    };
  }
}

// Update createApiClient to handle token more robustly
async function createApiClient(): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000
  });

  let token: string | null = null;

  // Try to get token from localStorage first
  if (typeof window !== "undefined") {
    token = localStorage.getItem("_t");
  }

  // If no token in localStorage, try to get visitor token
  if (!token) {
    const hostname =
      typeof window !== "undefined"
        ? window.location.hostname
        : await getServerHostname();
    token = await getVisitorToken(hostname);

    // console.log(token);

    if (token && typeof window !== "undefined") {
      localStorage.setItem("_t", token);
    }
  }

  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return client;
}

// Add common API response interface
interface ApiResponse<T = any> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

// Export HTTP methods
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return fetchApi<T>("GET", url, undefined, config);
}

export async function post<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  // console.log("Making POST request:", {
  //   url,
  //   data,
  //   headers: config?.headers
  // });

  try {
    const response = await fetchApi<T>("POST", url, data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "application/json"
      }
    });

    // console.log("POST response:", response);
    return response;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

export async function put<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return fetchApi<T>("PUT", url, data, config);
}

export const del = async <T>(
  url: string,
  options: { token?: string; config?: AxiosRequestConfig } = {}
): Promise<T> => {
  try {
    const client = await createApiClient();
    const response: AxiosResponse<T> = await client.delete(url, options.config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Client-side token handling
export const getClientToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("_t");
  }
  return null;
};

// For browser-side use only
export const setupClientApiInterceptors = (client: AxiosInstance) => {
  if (typeof window === "undefined") return;

  client.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("_t");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["cache"] = "reload";
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: any) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        try {
          const hostname = window.location.hostname;
          const res = await axios.get(
            `${API_BASE_URL}/website/getVisitorToken?domainName=${hostname}`
          );

          if (res.data.isSuccess && res?.data?.data?.token) {
            localStorage.setItem("_t", res?.data?.data?.token);
            window.location.reload();
          }
        } catch (innerError) {
          console.error("Error refreshing token:", innerError);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const getClientApiInstance = async (): Promise<AxiosInstance> => {
  const client = await createApiClient();
  return setupClientApiInterceptors(client) || client;
};

interface BusinessResponse {
  // Define the structure of BusinessResponse here
  id: string;
  name: string;
  // Add other fields as necessary
}

interface AddressResponse {
  // Define the structure of AddressResponse here
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Add other fields as necessary
}

interface ServiceResponse {
  isSuccess: boolean;
  message?: string;
  data: {
    services: Array<{
      _id: string;
      sku: string;
      title: string;
      description: string;
      media: Array<{
        url: string;
        type: string;
      }>;
    }>;
    pagination: {
      totalPages: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface ServiceDetailsResponse {
  isSuccess: boolean;
  message?: string;
  data: {
    _id: string;
    sku: string;
    title: string;
    description: string;
    duration?: string;
    price?: {
      amount: number;
      currency: string;
    };
    media: Array<{
      url: string;
      type: string;
    }>;
  };
}

interface BlogsResponse {
  isSuccess: boolean;
  message?: string;
  data: {
    blogs: Array<{
      _id: string;
      title: string;
      content: string;
      media: Array<{
        url: string;
        type: string;
      }>;
    }>;
    pagination: {
      totalPages: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface BlogDetailsResponse {
  isSuccess: boolean;
  message?: string;
  data: {
    _id: string;
    title: string;
    content: string;
    media: Array<{
      url: string;
      type: string;
    }>;
  };
}

interface Album {
  id: string;
  title: string;
  description: string;
  media: Array<{
    url: string;
    type: string;
  }>;
}

interface AlbumsResponse {
  isSuccess: boolean;
  data: Album[];
}

interface AlbumDetailsResponse {
  isSuccess: boolean;
  data: Album;
}

interface ProductsResponse {
  isSuccess: boolean;
  data: {
    products: Array<{
      _id: string;
      sku: string;
      title: string;
      description: string;
      price: {
        amount: number;
        currency: string;
      };
      media: Array<{
        url: string;
        type: string;
      }>;
    }>;
    totalProducts: number;
  };
}

interface CategoriesResponse {
  isSuccess: boolean;
  data: {
    categories: Array<{
      _id: string;
      name: string;
      description?: string;
    }>;
  };
}

export async function getMetaTagsOfPage(path: any) {
  let response = await fetchWithCache(path)
  return response.data;
};


export async function fetchWithCache(path: string, cacheTime: number = 3600) {

  // console.log("🚀 Fetching fresh metadata:", path);
  const apiClient = await createApiClient();
  const response = await apiClient.get(`/website/getMetaTagsOfPage?pageUrl=${path}`);

  if (response && response?.data && response?.data?.data) {
    return response.data;
  } else {
    console.warn("⚠️ No metadata found, using defaults.");
    return { title: "Default Title", description: "Default Description" };

  }
}
export const api = {
  auth: {
    async login(credentials: { email: string; password: string }) {
      try {
        const client = await createApiClient();
        const response = await client.post("/auth/login", credentials);

        if (!response?.data) {
          throw new Error("Invalid response from server");
        }

        const data = response.data;

        if (!data.isSuccess) {
          return {
            isSuccess: false,
            message: data.message || "Invalid credentials"
          };
        }

        return {
          isSuccess: true,
          data: {
            token: data.data.token,
            user: data.data.user
          },
          message: "Login successful"
        };
      } catch (error: any) {
        console.error(
          "Login API error:",
          error.response?.data || error.message
        );

        // Handle specific error cases
        if (error.response?.status === 400) {
          return {
            isSuccess: false,
            message: error.response.data.message || "Invalid credentials"
          };
        }

        if (error.response?.status === 429) {
          return {
            isSuccess: false,
            message: "Too many attempts. Please try again later."
          };
        }

        return {
          isSuccess: false,
          message: "An unexpected error occurred. Please try again."
        };
      }
    },
    async validate() {
      try {
        const client = await createApiClient();
        const response = await client.get("/website/user/validate");
        return response.data;
      } catch (error) {
        return { isSuccess: false };
      }
    },
    async register(data: {
      fullName: string;
      email: string;
      password: string;
    }) {
      try {
        const client = await createApiClient();
        const response = await client.post("/website/register", data);
        return response.data;
      } catch (error) {
        return { isSuccess: false, message: "Registration failed" };
      }
    }
  },
  business: {
    async getDetails() {
      const client = await createApiClient();
      return client.get<BusinessResponse>(
        "/website/getBusinessDetails?getJson=true"
      );
    },
    async getAddress() {
      const client = await createApiClient();
      return client.get<AddressResponse>("/website/getBusinessAddress");
    },
    async getServices(pageNumber: number = 1, limit: number = 10) {
      try {
        const client = await createApiClient();
        const response = await client.get<ServiceResponse>(
          `/website/getServices?pageNumber=${pageNumber}&limit=${limit}`
        );

        if (!response.data.isSuccess) {
          throw new Error(response.data.message || "Failed to fetch services");
        }

        return {
          isSuccess: true,
          data: {
            services: response.data.data.services || [],
            pagination: response.data.data.pagination || {
              totalPages: 1,
              currentPage: 1,
              totalItems: 0
            }
          }
        };
      } catch (error) {
        console.error("Error fetching services:", error);
        return {
          isSuccess: false,
          data: {
            services: [],
            pagination: {
              totalPages: 1,
              currentPage: 1,
              totalItems: 0
            }
          }
        };
      }
    },

    async getServiceDetails(sku: string) {
      try {
        const client = await createApiClient();
        const response = await client.get<ServiceDetailsResponse>(
          `/website/getServiceDetails?sku=${sku}`
        );

        if (!response.data.isSuccess) {
          throw new Error(
            response.data.message || "Failed to fetch service details"
          );
        }

        return {
          isSuccess: true,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error fetching service details:", error);
        return {
          isSuccess: false,
          data: null
        };
      }
    },

    async getBlogs(pageNumber: number = 1, limit: number = 10) {
      try {
        const client = await createApiClient();
        const response = await client.get<BlogsResponse>(
          `/website/getBlogs?pageNumber=${pageNumber}&limit=${limit}`
        );

        // console.log("API Blog Response:", {
        //   raw: response?.data,
        //   blogs: response?.data?.data?.blogs,
        //   pagination: response?.data?.data?.pagination
        // });

        if (!response?.data?.isSuccess) {
          throw new Error("Failed to fetch blogs");
        }

        const blogs = response.data.data.blogs || [];
        const pagination = response.data.data.pagination || {
          totalPages: Math.ceil(blogs.length / limit),
          currentPage: pageNumber,
          totalItems: blogs.length
        };

        return {
          isSuccess: true,
          data: {
            blogs: blogs,
            pagination: pagination
          }
        };
      } catch (error) {
        console.error("Error fetching blogs:", error);
        return {
          isSuccess: false,
          data: {
            blogs: [],
            pagination: {
              totalPages: 1,
              currentPage: pageNumber,
              totalItems: 0
            }
          },
          error:
            error instanceof Error ? error.message : "Failed to fetch blogs"
        };
      }
    },

    async getBlogDetails(sku: string) {
      try {
        const client = await createApiClient();
        const response = await client.get<BlogDetailsResponse>(
          `/website/getBlogDetails?sku=${sku}`
        );

        if (!response.data.isSuccess) {
          throw new Error("Failed to fetch blog details");
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching blog details:", error);
        return { isSuccess: false, data: null };
      }
    },

    async getAlbums(pageNumber: number = 1, limit: number = 10) {
      try {
        const client = await createApiClient();
        const response = await client.get<AlbumsResponse>(
          `/website/getAlbums?pageNumber=${pageNumber}&limit=${limit}`
        );

        if (!response.data.isSuccess) {
          throw new Error("Failed to fetch albums");
        }

        return {
          isSuccess: true,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error fetching albums:", error);
        return { isSuccess: false, data: [] };
      }
    },

    async getAlbumDetails(path: string) {
      try {
        const client = await createApiClient();
        const response = await client.get<AlbumDetailsResponse>(
          `/website/getAlbumDetails?path=${path}`
        );

        if (!response.data.isSuccess) {
          throw new Error("Failed to fetch album details");
        }

        return {
          isSuccess: true,
          data: response.data.data
        };
      } catch (error) {
        console.error("Error fetching album details:", error);
        return { isSuccess: false, data: null };
      }
    },

    async getTeams(pageNumber: number = 1, limit: number = 10) {
      try {
        const client = await createApiClient();
        const response = await client.get(
          `/website/getTeams?pageNumber=${pageNumber}&limit=${limit}`
        );
        return {
          isSuccess: true,
          data: {
            teams: response.data.data.teams || [],
            pagination: response.data.data.pagination || {
              totalPages: 1,
              currentPage: 1,
              totalItems: 0
            }
          }
        };
      } catch (error) {
        console.error("Error fetching teams:", error);
        return {
          isSuccess: false,
          data: {
            teams: [],
            pagination: { totalPages: 1, currentPage: 1, totalItems: 0 }
          }
        };
      }
    },

    async getTeamDetails(teamId: string) {
      try {
        const client = await createApiClient();
        const response = await client.get(`/website/getTeam?teamId=${teamId}`);
        return {
          isSuccess: true,
          data: response.data.data.teamDetails
        };
      } catch (error) {
        console.error("Error fetching team details:", error);
        return { isSuccess: false, data: null };
      }
    },

    async getMemberDetails(teamId: string, memberId: string) {
      try {
        const client = await createApiClient();
        const response = await client.get(
          `/website/getMember?teamId=${teamId}&memberId=${memberId}`
        );
        return {
          isSuccess: true,
          data: response.data.data.memberDetails
        };
      } catch (error) {
        console.error("Error fetching member details:", error);
        return { isSuccess: false, data: null };
      }
    },

    async sendContactMessage(data: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
      isNewsLetterSubscribed: boolean;
      businessId: string;
    }) {
      try {
        const client = await createApiClient();
        await client.post("/website/contact", data);

        return {
          isSuccess: true,
          message: "Message sent successfully!"
        };
      } catch (error) {
        console.error("Error sending contact message:", error);
        return {
          isSuccess: false,
          message: "Failed to send message"
        };
      }
    }
  },
  products: {
    async getProducts(page = 1, limit = 9, sortBy = "NEWLY_ADDED") {
      return get(
        `/website/fetchProducts?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}`
      );
    },

    async getProductsByCategory(
      categoryId: string,
      page = 1,
      limit = 9,
      sortBy = "NEWLY_ADDED"
    ) {
      return get(
        `/website/fetchProductsByCategory?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&categoryId=${categoryId}`
      );
    },

    async getProductDetails(sku: string) {
      try {
        const response: any = await get(
          `/website/fetchProductDetails?productId=${sku}`
        );

        if (!response.isSuccess) {
          throw new Error("Unable to fetch products");
        }

        return {
          isSuccess: true,
          data: {
            product: {
              ...response.data.product,
              files: response.data.product.files || [],
              price: {
                sellingPrice: Number(response.data.product.price?.sellingPrice),
                mrp: Number(response.data.product.price?.mrp)
              },
              gst: {
                gstRate: Number(response.data.product.gst?.gstRate || 0),
                gstInclusive: Boolean(response.data.product.gst?.gstInclusive)
              },
              averageRating: Number(response.data.product.averageRating || 0),
              reviews: response.data.product.reviews || []
            }
          }
        };
      } catch (error) {
        console.error("Product details error:", error);
        return {
          isSuccess: false,
          message: "Failed to fetch product details",
          data: null
        };
      }
    },

    async getCategories(page = 1, limit = 100) {
      return get(`/website/fetchCategories?pageNumber=${page}&limit=${limit}`);
    }
  },
};

export default getClientApiInstance;
