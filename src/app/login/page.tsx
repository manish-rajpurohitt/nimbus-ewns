import LoginForm from "@/components/Auth/LoginForm";
import { fetchBusinessData } from "@/utils/api.utils";

interface PageProps {
  searchParams: Promise<{ error?: string; registered?: string }>;
}

export default async function LoginPage({ searchParams }: any) {
  const [params, businessRes] = await Promise.all([
    searchParams,
    fetchBusinessData()
  ]);

  const businessName = businessRes?.data?.business?.businessName;

  return (
    <LoginForm
      businessName={businessName}
      showSuccessMessage={params?.registered === "true"}
      error={params?.error}
    />
  );
}
