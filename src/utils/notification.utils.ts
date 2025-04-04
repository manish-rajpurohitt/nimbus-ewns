import { toast } from "sonner";

export const showSuccessMessage = (message: string) => {
  toast.success(message, {
    duration: 5000,
    className: "success-toast",
    icon: "✅",
    position: "top-center",
    style: {
      background: "#059669", // Darker green for better contrast
      color: "white",
      fontSize: "16px",
      padding: "16px 24px",
      borderRadius: "8px",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      animation: "slide-up 0.3s ease-out, fadeIn 0.3s ease-out",
      fontWeight: "500"
    }
  });
};

export const showErrorMessage = (message: string) => {
  toast.error(message, {
    duration: 5000,
    className: "error-toast",
    icon: "❌",
    position: "top-center",
    style: {
      background: "#DC2626", // Darker red for better contrast
      color: "white",
      fontSize: "16px",
      padding: "16px 24px",
      borderRadius: "8px",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      animation: "shake 0.5s ease-in-out",
      fontWeight: "500"
    }
  });
};
