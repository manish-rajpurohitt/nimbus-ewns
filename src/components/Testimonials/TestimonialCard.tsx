import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { TestimonialData } from "../../types/testimonial.types";

export default function TestimonialCard({
  userName,
  title,
  feedback,
  rating,
  userLogo
}: TestimonialData) {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const hasOverflow =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setShowReadMore(hasOverflow);
    }
  }, [feedback]);

  const initials = userName
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        {userLogo?.url ? (
          <div className="relative w-16 h-16">
            <Image
              src={userLogo.url}
              alt={userName}
              fill
              className="testimonial-image"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="avatar-placeholder">{initials}</div>
        )}

        <div className="testimonial-info">
          <h4>{userName}</h4>
          <p>{title.length > 30 ? `${title.slice(0, 30)}...` : title}</p>
        </div>

        <div className="quote-mark">
          <Quote size={24} />
        </div>
      </div>

      <div className="testimonial-content">
        <p
          ref={contentRef}
          className={`testimonial-comment ${expanded ? "expanded" : ""}`}
        >
          {feedback}
        </p>
        {showReadMore && (
          <button className="read-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      <div className="rating">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }
          />
        ))}
      </div>
    </div>
  );
}
