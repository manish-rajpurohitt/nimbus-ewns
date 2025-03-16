import Image from "next/image";
import Link from "next/link";
import { Camera, Video, FolderOpen, ChevronRight } from "lucide-react";
import type { Album } from "@/types/album.types";

interface AlbumDetailsProps {
  album: Album;
  businessData: {
    staticData?: {
      albums?: {
        title?: string;
        subTitle?: string;
      };
    };
  };
}

export default function AlbumDetails({ album }: AlbumDetailsProps) {
  // Update breadcrumb generation to handle slashes properly
  const generateBreadcrumbs = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    let currentPath = "";

    return segments.map((segment, index) => {
      currentPath = currentPath + "/" + segment;
      return {
        name: decodeURIComponent(segment).replace(/-/g, " "),
        path: currentPath,
        isLast: index === segments.length - 1
      };
    });
  };

  const hasImages = album.images && album.images.length > 0;
  const hasVideos = album.videos && album.videos.length > 0;
  const hasSubAlbums = album.subAlbums && album.subAlbums.length > 0;
  const hasContent = hasImages || hasVideos || hasSubAlbums;

  const getAllMedia = (currentAlbum: Album) => {
    let allMedia = [
      ...(currentAlbum.images || []).map((img) => ({
        ...img,
        type: "image" as const
      })),
      ...(currentAlbum.videos || []).map((vid) => ({
        ...vid,
        type: "video" as const
      }))
    ];

    if (currentAlbum.subAlbums) {
      currentAlbum.subAlbums.forEach((subAlbum) => {
        allMedia = [...allMedia, ...getAllMedia(subAlbum)];
      });
    }

    return allMedia;
  };

  const allMedia = getAllMedia(album);

  const getUniqueAlbumId = (subAlbum: any) => {
    return `${subAlbum.path}-${subAlbum._id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center gap-2 mb-8 text-sm bg-gray-50 p-4 rounded-lg">
        <Link
          href="/albums"
          className="inline-flex items-center text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
        >
          <FolderOpen className="w-4 h-4 mr-1" />
          Albums
        </Link>

        {generateBreadcrumbs(album.path).map((crumb) => (
          <div key={crumb.path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={`/albums${crumb.path}`}
              className={`${
                crumb.isLast
                  ? "text-gray-600 font-medium"
                  : "text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
              }`}
            >
              {crumb.name}
            </Link>
          </div>
        ))}
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
        <div className="flex gap-4 mt-4">
          {hasImages && (
            <span className="flex items-center text-gray-600">
              <Camera className="w-5 h-5 mr-1" />
              {album.images?.length} Images
            </span>
          )}
          {hasVideos && (
            <span className="flex items-center text-gray-600">
              <Video className="w-5 h-5 mr-1" />
              {album.videos?.length} Videos
            </span>
          )}
          {hasSubAlbums && (
            <span className="flex items-center text-gray-600">
              <FolderOpen className="w-5 h-5 mr-1" />
              {album.subAlbums?.length} Sub Albums
            </span>
          )}
        </div>
      </div>

      {!hasContent && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Media Available
          </h2>
          <p className="text-gray-600">This album is currently empty.</p>
        </div>
      )}

      {/* Sub-Albums Section */}
      {hasSubAlbums && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Sub Albums</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {album.subAlbums?.map((subAlbum) => (
              <Link
                key={`${subAlbum.path}-${subAlbum._id}`}
                href={`/albums${subAlbum.path}`}
                className="group bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all"
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={
                      subAlbum.images?.[0]?.thumbnailUrl ||
                      subAlbum.images?.[0]?.originalUrl ||
                      "/default-album.jpg"
                    }
                    alt={subAlbum.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{subAlbum.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {(subAlbum.images?.length ?? 0) > 0 && (
                      <span className="flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        {subAlbum.images?.length ?? 0}
                      </span>
                    )}
                    {(subAlbum.videos?.length ?? 0) > 0 && (
                      <span className="flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        {subAlbum.videos?.length ?? 0}
                      </span>
                    )}
                    {(subAlbum.subAlbums?.length ?? 0) > 0 && (
                      <span className="flex items-center">
                        <FolderOpen className="w-4 h-4 mr-1" />
                        {subAlbum.subAlbums?.length ?? 0}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allMedia.map((media) => (
          <Link
            key={media._id}
            href={`/albums${album.path}/media/${media._id}`.replace(
              /\/+/g,
              "/"
            )}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <Image
              src={
                media.type === "image"
                  ? media.thumbnailUrl || media.originalUrl
                  : media.thumbnailUrl || "/video-thumbnail.jpg"
              }
              alt=""
              fill
              className="object-cover group-hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {media.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Video className="w-12 h-12 text-white" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
