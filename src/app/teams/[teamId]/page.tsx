import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import TeamDetails from "@/components/Teams/TeamDetails";
import { notFound } from "next/navigation";

interface TeamPageProps {
  params: { teamId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TeamPage({
  params,
  searchParams
}: TeamPageProps) {
  const teamId = await Promise.resolve(params.teamId);
  const page = await Promise.resolve(searchParams.page);
  const currentPage = Number(page) || 1;

  try {
    const [businessRes, teamRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getTeamDetails(teamId)
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
