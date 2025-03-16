import { api } from "@/lib/api";
import { fetchBusinessData } from "@/utils/api.utils";
import AlbumDetails from "@/components/Albums/AlbumDetails";
import { notFound } from "next/navigation";

export default async function AlbumPage({ params }: any) {
  try {
    // Get paths in parallel with data fetching
    const promises = Promise.all([
      // Handle path decoding safely
      Promise.resolve(decodeURIComponent(params.path)),
      fetchBusinessData()
    ]);

    // Wait for path and initial data
    const [decodedPath, businessRes] = await promises;

    // Then fetch album data with decoded path
    const albumRes : any = await api.business.getAlbumDetails(decodedPath);

    if (!businessRes?.isSuccess || !albumRes?.isSuccess || !albumRes.data) {
      console.error("Failed to fetch album:", decodedPath);
      notFound();
    }

    return (
      <AlbumDetails businessData={businessRes.data} album={albumRes.data} />
    );
  } catch (error) {
    console.error("Error in AlbumPage:", error);
    notFound();
  }
}
