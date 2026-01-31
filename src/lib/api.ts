import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies, headers } from "next/headers";
import { getOrFetchToken } from "./token-cache";

// Base URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.ewns.in/api";

/**
 * Actual token fetch function (used by getOrFetchToken for deduplication)
 */
async function fetchTokenFromAPI(domainName: string, retryCount = 0): Promise<string | null> {
  const maxRetries = 2;
  const retryDelay = 1000;

  try {
    console.log(`[API] 🌐 Fetching token from API for: ${domainName} (attempt ${retryCount + 1})`);
    
    const res = await axios.get(
      `${API_BASE_URL}/website/getVisitorToken?domainName=${domainName}`,
      {
        timeout: 5000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    if (res.data?.isSuccess && res.data?.data?.token) {
      console.log(`[API] ✅ Token fetched successfully for: ${domainName}`);
      return res.data.data.token;
    }

    throw new Error("Invalid token response");
  } catch (error: any) {
    if (retryCount < maxRetries) {
      console.log(`[API] 🔄 Retrying token fetch for: ${domainName}`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return fetchTokenFromAPI(domainName, retryCount + 1);
    }
    
    const errorMessage = error?.response?.data?.message || error.message;
    console.error(`[API] ❌ Token fetch failed for ${domainName}:`, errorMessage);
    return null;
  }
}

/**
 * Get visitor token with caching and deduplication
 * Prevents multiple simultaneous API calls for the same domain
 */
async function getVisitorToken(domainName: string): Promise<string | null> {
  try {
    // Normalize domain
    if (!domainName || domainName.includes("localhost")) {
      domainName = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || process.env.DEFAULT_DOMAIN;
    }

    // Use getOrFetchToken which handles caching and deduplication
    return await getOrFetchToken(domainName, fetchTokenFromAPI);
  } catch (error: any) {
    console.error(`[API] Unexpected error getting token:`, error);
    return null;
  }
}

const getServerHostname = async (): Promise<string> => {
  const headersList = await headers();
  const host = headersList.get("host");
  return host || process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || process.env.DEFAULT_DOMAIN;
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
    const client = await createApiClient();
    const maxRetries = 2;
    const headers = {
      ...client.defaults.headers,
      ...(config?.headers || {})
    };

    let response;
    try {
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
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle 401/500 errors with retry
        if (
          [401, 500].includes(error.response?.status || 0) &&
          retryCount < maxRetries
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Try to refresh token on 401
          if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("_t");
            }
            const hostname =
              typeof window !== "undefined"
                ? window.location.hostname
                : await getServerHostname();
            const newToken = await getVisitorToken(hostname);
            if (newToken) {
              return fetchApi<T>(method, url, data, config, retryCount + 1);
            }
          }

          // Generic retry for 500
          return fetchApi<T>(method, url, data, config, retryCount + 1);
        }
      }
      throw error;
    }
  } catch (error: any) {
    const apiError: ApiError = new Error(error.message || "API request failed");
    apiError.status = axios.isAxiosError(error) ? error.response?.status : 500;
    apiError.response = axios.isAxiosError(error) ? error.response?.data : null;

    return {
      isSuccess: false,
      message:
        apiError.response?.message ||
        apiError.message ||
        "An unexpected error occurred",
      error: {
        status: apiError.status,
        message: apiError.message
      }
    };
  }
}

export async function createApiClient(): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  // Get token from cookies first
  const cookieStore = await cookies();
  let token = cookieStore.get("access_token")?.value;

  // If no token in cookies, try to get from cache or fetch
  if (!token) {
    const hostname = await getServerHostname();
    token = await getVisitorToken(hostname);
  }
 
  if (token) {
    client.defaults.headers["Authorization"] = `Bearer ${token}`;
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
  try {
    const response = await fetchApi<T>("POST", url, data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "application/json"
      }
    });

    return response;
  } catch (error) {
    // console.error("POST request failed:", error);
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
          // console.error("Error refreshing token:", innerError);
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
  id: string;
  name: string;
}

interface AddressResponse {
  street: string;
  city: string;
  state: string;
  zipCode: string;
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
  let response = await fetchWithCache(path);
  return response?.data;
}

// Update fetchWithCache with better error handling
export async function fetchWithCache(path: string, cacheTime: number = 3600) {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(
      `/website/getMetaTagsOfPage?pageUrl=${path}`
    );

    if (response?.data?.isSuccess && response?.data?.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    // console.warn("⚠️ Error fetching metadata:", error);
    return null;
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
        // console.error(
        //   "Login API error:",
        //   error.response?.data || error.message
        // );

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
    async getServices(
      pageNumber: number = 1,
      limit: number = 10,
      sortBy: string = "createdAt_desc"
    ) {
      try {
        const client = await createApiClient();
        const skip = (pageNumber - 1) * limit;

        const response = await client.get<ServiceResponse>(
          `/website/getServices?pageNumber=${pageNumber}&limit=${limit}&skip=${skip}&sortBy=${sortBy}`
        );

        if (!response.data.isSuccess) {
          throw new Error("Failed to fetch services");
        }

        const services = response.data.data.services || [];
        const total = response.data.data.pagination.total || 0;
        const actualTotalPages = Math.ceil(total / limit);

        // Add debug logging to check for duplicates
        const serviceIds = services.map((s) => s.sku);
        const uniqueIds = new Set(serviceIds);

        if (serviceIds.length !== uniqueIds.size) {
          // console.warn("Duplicate services detected in API response:", {
          //   total: serviceIds.length,
          //   unique: uniqueIds.size,
          //   duplicates: serviceIds.filter(
          //     (id, index) => serviceIds.indexOf(id) !== index
          //   )
          // });
        }

        return {
          isSuccess: true,
          data: {
            services: services,
            pagination: {
              totalPages: actualTotalPages,
              currentPage: pageNumber,
              totalItems: total,
              itemsPerPage: limit
            }
          }
        };
      } catch (error) {
        // console.error("Error fetching services:", error);
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
        const response = await client.post("/website/contact", data);

        return {
          isSuccess: response?.data?.isSuccess ?? false,
          message: response?.data?.message || "Message sent successfully!"
        };
      } catch (error) {
        console.error("Contact API error:", error); // Debug log
        return {
          isSuccess: false,
          message: "Failed to send message"
        };
      }
    },

    async getAllServices() {
      try {
        const client = await createApiClient();

        const response = await client.get<ServiceResponse>(
          `/website/getServices?getAll=true`
        );

        if (!response.data.isSuccess) {
          throw new Error("Failed to fetch all services");
        }

        return {
          isSuccess: true,
          data: {
            services: response.data.data.services || []
          }
        };
      } catch (error) {
        console.error("Error fetching all services:", error);
        return {
          isSuccess: false,
          data: {
            services: []
          }
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
  }
};

export default getClientApiInstance;
