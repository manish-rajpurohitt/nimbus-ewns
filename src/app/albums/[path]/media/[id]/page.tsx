import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

async function getPageData(path: string) {
  try {
    // Clean the path before making the API call
    const cleanPath = path.replace(/^\/+|\/+$/g, "");

    const [businessRes, albumRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getAlbumDetails(cleanPath)
    ]);

    if (!businessRes?.isSuccess || !albumRes?.isSuccess || !albumRes.data) {
      return null;
    }

    return {
      business: businessRes.data,
      album: albumRes.data
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

export default async function MediaPage({ params }: any) {
  try {
    // Handle params safely in parallel
    const [decodedPath, pageData] = await Promise.all([
      Promise.resolve(decodeURIComponent(params.path)),
      getPageData(params.path)
    ]);

    if (!pageData) {
      notFound();
    }

    const path = decodedPath.replace(/^\/+|\/+$/g, "");
    const id = params.id;

    const allMedia = getAllMedia(pageData.album);
    const currentIndex = allMedia.findIndex((m) => m._id === id);
    const currentMedia = allMedia[currentIndex];

    if (!currentMedia) {
      notFound();
    }

    const prevMedia = allMedia[currentIndex - 1];
    const nextMedia = allMedia[currentIndex + 1];

    const albumTitle = pageData.album.title || "Album";

    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Professional Header Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm p-3 md:p-4 flex items-center justify-between z-10">
          <Link
            href={`/albums/${path}`.replace(/\/+/g, "/")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">{albumTitle}</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </header>

        {/* Media Display - White/Light Theme */}
        <main className="flex-1 flex items-center justify-center bg-white sm:bg-gray-50 p-2 md:p-6 overflow-hidden">
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            {currentMedia.type === "video" ? (
              <div className="w-full h-full flex items-center justify-center bg-black sm:rounded-xl shadow-xl overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="max-w-full max-h-full w-full h-full sm:w-auto sm:h-auto"
                  style={{ maxHeight: "calc(100vh - 10rem)" }}
                >
                  <source src={currentMedia.url} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-full h-full max-w-5xl max-h-[calc(100vh-10rem)] bg-white p-1 sm:p-3 sm:rounded-xl sm:shadow-xl relative">
                  <div className="relative w-full h-full">
                    <Image
                      src={currentMedia.originalUrl}
                      alt=""
                      className="object-contain"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                      priority
                      quality={95}
                      key={currentMedia.originalUrl}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Responsive Footer Controls */}
        <footer className="bg-white border-t border-gray-200 p-3 sm:hidden flex justify-center gap-6">
          {prevMedia && (
            <Link
              href={`/albums/${path}/media/${prevMedia._id}`.replace(
                /\/+/g,
                "/"
              )}
              className="w-14 h-14 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
              aria-label="Previous media"
            >
              <ChevronLeft size={28} />
            </Link>
          )}

          {nextMedia && (
            <Link
              href={`/albums/${path}/media/${nextMedia._id}`.replace(
                /\/+/g,
                "/"
              )}
              className="w-14 h-14 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
              aria-label="Next media"
            >
              <ChevronRight size={28} />
            </Link>
          )}
        </footer>

        {/* Desktop Navigation Controls - Side buttons */}
        <div className="hidden sm:flex w-full items-center justify-between px-6 pointer-events-none absolute inset-y-0 top-16 left-0 right-0">
          <div>
            {prevMedia && (
              <Link
                href={`/albums/${path}/media/${prevMedia._id}`.replace(
                  /\/+/g,
                  "/"
                )}
                className="p-4 bg-white text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 pointer-events-auto transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Previous media"
              >
                <ChevronLeft size={24} />
              </Link>
            )}
          </div>

          <div>
            {nextMedia && (
              <Link
                href={`/albums/${path}/media/${nextMedia._id}`.replace(
                  /\/+/g,
                  "/"
                )}
                className="p-4 bg-white text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 pointer-events-auto transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Next media"
              >
                <ChevronRight size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in MediaPage:", error);
    notFound();
  }
}

function getAllMedia(album: any) {
  let media = [
    ...(album.images || []).map((img: any) => ({
      ...img,
      type: "image" as const
    })),
    ...(album.videos || []).map((vid: any) => ({
      ...vid,
      type: "video" as const
    }))
  ];

  if (album.subAlbums) {
    album.subAlbums.forEach((subAlbum: any) => {
      media = [...media, ...getAllMedia(subAlbum)];
    });
  }

  return media;
}
