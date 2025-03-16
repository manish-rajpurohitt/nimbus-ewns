import { fetchBusinessData } from "@/utils/api.utils";
import Testimonials from "@/components/Testimonials";

export default async function TestimonialsPage() {
  const businessRes = await fetchBusinessData();

  const testimonials = businessRes?.data?.business?.testimonials || [];
  const staticData = businessRes?.data?.staticData?.testimonials;

  return (
    <Testimonials
      testimonials={testimonials}
      staticData={staticData}
      isHomepage={false}
    />
  );
}
