import { api } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils";
import AlbumGrid from "@/components/Albums/AlbumGrid";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";

export default async function AlbumsPage({
  searchParams
}:any) {
  try {
    const page = Number(searchParams.page) || 1;
    const [businessRes, albumsRes] : any[] = await Promise.all([
      fetchBusinessData(),
      api.business.getAlbums(page, 12)
    ]);

    if (!businessRes?.isSuccess || !albumsRes?.isSuccess) {
      throw new Error("Failed to fetch albums");
    }

    return (
      <>
        <PageBanner
          bannerImage="https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&q=80"
          title="Photo Gallery"
          currentPage="Gallery"
        />
        <AlbumGrid
          businessData={businessRes.data}
          albums={albumsRes.data}
          currentPage={page}
        />
      </>
    );
  } catch (error) {
    console.error("Error in AlbumsPage:", error);
    notFound();
  }
}
