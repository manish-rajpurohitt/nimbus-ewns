import type { TestimonialData } from "../../types/testimonial.types";
import ClientSlider from "../ClientSlider";

interface TestimonialsProps {
  testimonials: TestimonialData[];
  staticData?: {
    title?: string;
    subTitle?: string;
  };
  isHomepage?: boolean;
}

export default function Testimonials({
  testimonials,
  staticData,
  isHomepage = false
}: TestimonialsProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="testimonials-section">
      <div className="section-container-testimonials">
        {isHomepage && (
          <div className="main-section-header">
            <div className="section-subtitle">
              {staticData?.title || "TESTIMONIALS"}
            </div>
            <div className="subheading">
              {staticData?.subTitle ||
                "Read the success stories from our valued customers"}
            </div>
          </div>
        )}

        <div className="slider-container">
          <ClientSlider testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
