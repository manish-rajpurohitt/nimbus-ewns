import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import { fetchBusinessData } from "@/utils/api.utils";

interface PageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: any) {
  const [params, businessRes] :any = await Promise.all([
    searchParams,
    fetchBusinessData()
  ]);

  const businessName :any = businessRes?.data?.business?.businessName;

  return (
    <ForgotPasswordForm
      businessName={businessName}
      error={params?.error}
      success={params?.success}
    />
  );
}
