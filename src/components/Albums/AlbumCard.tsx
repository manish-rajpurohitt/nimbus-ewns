import Image from "next/image";
import Link from "next/link";
import { Camera, Video, Folder } from "lucide-react";
import type { Album } from "@/types/album.types";

export default function AlbumCard({ album }: { album: Album }) {
  const getThumbnail = () => {
    const firstImage =
      album.images?.[0]?.thumbnailUrl || album.images?.[0]?.originalUrl;
    const firstVideo = album.videos?.[0]?.thumbnailUrl;
    return firstImage || firstVideo || "/default-album.jpg";
  };

  const itemCount = {
    images: album.images?.length || 0,
    videos: album.videos?.length || 0,
    subAlbums: album.subAlbums?.length || 0
  };

  return (
    <Link href={`/albums${album.path}`} className="media-card">
      <div className="media-preview">
        <Image
          src={getThumbnail()}
          alt={album.name}
          fill
          className="media-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          key={getThumbnail()}
        />
        <div className="media-overlay">
          <div className="media-type-icon"></div>
        </div>
      </div>

      <div className="media-info">
        <h3>{album.name}</h3>
        <div className="folder-type-count">
          {itemCount.images > 0 && (
            <span className="type-count">
              <Camera className="icon" />
              {itemCount.images}
            </span>
          )}
          {itemCount.videos > 0 && (
            <span className="type-count">
              <Video className="icon" />
              {itemCount.videos}
            </span>
          )}
          {itemCount.subAlbums > 0 && (
            <span className="type-count">
              <Folder className="icon" />
              {itemCount.subAlbums}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
