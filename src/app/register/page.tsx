import RegisterForm from "@/components/Auth/RegisterForm";
import { fetchBusinessData } from "@/utils/api.utils";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const [params, businessRes]:any = await Promise.all([
    searchParams,
    fetchBusinessData()
  ]);

  const businessName = businessRes?.data?.business?.businessName;

  return <RegisterForm businessName={businessName} error={params?.error} />;
}
