import { Camera, Video, Folder } from "lucide-react";
import AlbumCard from "./AlbumCard";
import { debugLog } from "@/utils/debug.util";
import type { Album } from "@/types/album.types";

interface AlbumGridProps {
  businessData: {
    staticData?: {
      albums?: {
        title?: string;
        subTitle?: string;
      };
    };
  };
  albums: Album[];
  currentPage?: number;
}

export default function AlbumGrid({
  businessData,
  albums = [],
  currentPage = 1
}: AlbumGridProps) {
  debugLog("AlbumGrid", "Rendering with data", {
    businessData,
    albums,
    currentPage
  });

  const staticData = businessData?.staticData?.albums;

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <div className="banner-text-gallery">
          <h1>{staticData?.title || "Digital Media Gallery"}</h1>
          <p>{staticData?.subTitle || "Explore our gallery collection"}</p>
        </div>

        <div className="view-options">
          <button className="view-option">
            <Camera size={20} />
            <span>Images</span>
          </button>
          <button className="view-option">
            <Video size={20} />
            <span>Videos</span>
          </button>
          <button className="view-option">
            <Folder size={20} />
            <span>Albums</span>
          </button>
        </div>

        {albums.length > 0 ? (
          <div className="media-grid">
            {albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No albums found</p>
          </div>
        )}
      </div>
    </div>
  );
}
