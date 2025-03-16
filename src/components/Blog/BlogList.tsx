import type { BlogData } from "@/types/blog.types";
import BlogCard from "./BlogCard";
import Link from "next/link";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";

interface BlogListProps {
  blogs: BlogData[];
  businessData: {
    data?: {
      business?: {
        staticData?: {
          blogs?: {
            heading?: string;
            subheading?: string;
            buttonText?: string;
          };
          home?: {
            blogs?: {
              heading?: string;
              subheading?: string;
              buttonText?: string;
            };
          };
        };
      };
    };
  };
  isHomepage?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export default function BlogList({
  blogs = [],
  businessData,
  isHomepage = false,
  currentPage = 1,
  totalPages = 1
}: BlogListProps) {
  const staticData = isHomepage
    ? businessData?.data?.business?.staticData?.home?.blogs
    : businessData?.data?.business?.staticData?.blogs;

  const displayedBlogs = isHomepage ? blogs.slice(0, 3) : blogs;

  if (!displayedBlogs?.length) return <Loader />;

  return (
    <section className="">
      <div className="section-container">
        <div className="main-section-header">
          <h6 className="section-subtitle">
            {staticData?.heading || "Latest Updates"}
          </h6>
          <div className="subheading">
            <div>{staticData?.subheading || "New Latest Articles"}</div>
          </div>
        </div>

        <div className="news-grid">
          {displayedBlogs.map((blog) => (
            <BlogCard key={blog._id} {...blog} />
          ))}
        </div>

        {isHomepage && blogs.length > 3 && (
          <div className="read-more-link-container">
            <Link href="/blogs" className="read-more-link">
              {staticData?.buttonText || "View All Blogs"}
            </Link>
          </div>
        )}

        {!isHomepage && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blogs"
            />
          </div>
        )}
      </div>
    </section>
  );
}
