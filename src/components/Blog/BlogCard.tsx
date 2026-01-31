import Image from "next/image";
import Link from "next/link";
import { MdReadMore } from "react-icons/md";
import { BlogData } from "@/types/blog.types";
import { removeHtmlTags } from "@/utils/common.util";

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateStr));
};

export default function BlogCard({
  title,
  createdAt,
  sku,
  description,
  media
}: BlogData) {
  return (
    <Link href={`/blog/${sku}`} className="news-card">
      <div className="news-image-container">
        <Image
          src={media?.[0]?.url || "/default-image.jpg"}
          alt={title}
          className="news-image"
          key={media?.[0]?.url}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="news-content">
        <p className="news-date">{formatDate(createdAt)}</p>
        <h3 className="news-title">{title}</h3>
        <p className="news-subtitle dreciption-news">
          {description?.length > 150
            ? removeHtmlTags(description.slice(0, 150)) + "..."
            : removeHtmlTags(description)}
        </p>
        <div className="blog-read-more">
          <div className="read-more-blog">Read More</div>
          <div className="arrow">
            <MdReadMore />
          </div>
        </div>
      </div>
    </Link>
  );
}
