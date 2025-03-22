import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import TeamGrid from "@/components/Teams/TeamGrid";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getPageMEtadata } from "@/utils/common.util";

export default async function TeamsPage({
  searchParams
}:any) {
  try {
    const page = Number(searchParams.page) || 1;
    const TEAMS_PER_PAGE = 3; // Show 3 teams per page

    const [businessRes, teamsRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getTeams(page, TEAMS_PER_PAGE)
    ]);

    if (!businessRes?.isSuccess || !teamsRes?.isSuccess) {
      throw new Error("Failed to fetch teams data");
    }

    // Ensure pagination data is properly structured
    const pagination = {
      currentPage: page,
      totalPages: teamsRes.data.pagination.totalPages
    };

    return (
      <div className="teams-page">
        <PageBanner
          bannerImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
          title="Our Teams"
          currentPage="Teams"
        />
        <TeamGrid
          businessData={businessRes.data}
          teams={teamsRes.data.teams}
          pagination={pagination}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in TeamsPage:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: any; }): Promise<Metadata> {
  console.log("🚀 Running generateMetadata for:", params);

  try {

    const headerList = await headers();
    const protocol = headerList.get("x-forwarded-proto") || "https";
    const host = headerList.get("host") || "example.com";
    const fullUrl = `${protocol}://${host}/teams`;
    // const fullUrl = `https://icontechpro.com/teams`;

    return await getPageMEtadata(fullUrl);
  } catch (error) {
    console.error("⚠️ Metadata Error:", error);
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}