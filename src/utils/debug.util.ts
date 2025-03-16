export const debugLog = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    // console.log(`[${component}] ${message}`, data ? JSON.stringify(data) : "");
  }
};

export const debugError = (component: string, error: any) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${component} Error]`, error);
  }
};
