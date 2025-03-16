import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import TeamDetails from "@/components/Teams/TeamDetails";
import { notFound } from "next/navigation";

export default async function TeamPage({
  params,
  searchParams
}:any) {
  try {
    const currentPage = Number(searchParams.page) || 1;
    const [businessRes, teamRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getTeamDetails(params.teamId)
    ]);

    if (!businessRes?.isSuccess || !teamRes?.isSuccess) {
      notFound();
    }

    return (
      <TeamDetails
        businessData={businessRes.data}
        teamData={teamRes.data}
        currentPage={currentPage}
      />
    );
  } catch (error) {
    console.error("Error in TeamPage:", error);
    notFound();
  }
}
