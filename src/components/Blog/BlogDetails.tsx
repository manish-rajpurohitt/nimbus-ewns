import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { FaSpinner } from "react-icons/fa";
import MediaGallery from "../MediaGallery";
import { formatDate } from "@/utils/date.util";
import { debugLog } from "@/utils/debug.util";
import type { BlogData } from "@/types/blog.types";

interface BlogDetailsProps {
  blogData: BlogData;
  businessData?: any;
}

export default function BlogDetails({
  blogData,
  businessData
}: any) {
  debugLog("BlogDetails", "Rendering with data", { blogData, businessData });

  if (!blogData) {
    return (
      <div className="details__loading">
        <FaSpinner className="details__loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  const uniqueMedia = blogData?.media?.reduce((acc: any[], curr: any) => {
    const exists = acc.find((item: any) => item.url === curr.url);
    if (!exists) acc.push(curr);
    return acc;
  }, []);

  return (
    <div className="details">
      <div className="details__banner main-page-container">
        {uniqueMedia && uniqueMedia.length > 0 && (
          <div className="details__banner-single">
            <Image
              src={uniqueMedia[0].url || "https://placehold.co/600.png"}
              alt={blogData?.title || "Blog banner"}
              fill
              className="details__banner-image"
              priority
              key={uniqueMedia[0].url}
            />
          </div>
        )}

        <div className="details__banner-overlay">
          <div className="details__intro">
            {blogData?.media?.[0]?.url ? (
              <Image
                src={blogData.media[0].url}
                key={blogData.media[0].url}
                alt={blogData?.title}
                width={80}
                height={80}
                className="details__department-icon"
              />
            ) : (
              <Image
                src={"https://placehold.co/600.png?text=Blog+Details+Banner"}
                key={"https://placehold.co/600.png?text=Blog+Details+Banner"}
                alt={blogData?.title}
                width={80}
                height={80}
                className="details__department-icon"
              />
            )}
            <div className="details__title-wrapper">
              <h2 className="details__title">{blogData?.title}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="details__content">
        <section className="details__description">
          <div className="details__description-content">
            <h1 className="details__subtitle">{blogData?.subTitle}</h1>
            <div
              className="details__text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blogData?.description)
              }}
            />

            {blogData?.bloggerName && (
              <div className="details__service-info">
                <div className="details__info-item">
                  <h3 className="details__info-label">Blog Written By:</h3>
                  <p className="details__info-value">{blogData.bloggerName}</p>
                </div>
              </div>
            )}
          </div>

          {uniqueMedia && uniqueMedia.length > 1 && (
            <div className="details__media">
              <h2 className="details__media-title">Blog Media</h2>
              <div className="details__media-grid">
                <MediaGallery media={uniqueMedia} />
              </div>
            </div>
          )}

          {blogData?.comments?.length > 0 && (
            <div className="details__comments">
              <h2 className="details__subtitle">Comments</h2>
              <div className="details__comments-grid">
                {blogData.comments.map((comment: any, index: number) => (
                  <div key={index} className="details__comment-card">
                    <div className="details__comment-avatar">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="details__comment-content">
                      <div className="details__comment-header">
                        <span className="details__comment-author">
                          {comment.userName}
                        </span>
                        <span className="details__comment-date">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="details__comment-text">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
