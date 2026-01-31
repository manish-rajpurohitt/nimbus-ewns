import { fetchBusinessData } from "@/utils/api.utils";
import { api } from "@/lib/api";
import MemberDetails from "@/components/Teams/MemberDetails";
import { notFound } from "next/navigation";

interface MemberPageProps {
  params: { teamId: string; memberId: string };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { teamId, memberId } = await params;

  try {
    const [businessRes, memberRes] = await Promise.all([
      fetchBusinessData(),
      api.business.getMemberDetails(teamId, memberId)
    ]);

    if (!businessRes?.isSuccess || !memberRes?.isSuccess) {
      notFound();
    }

    return (
      <MemberDetails
        businessData={businessRes.data}
        memberData={memberRes.data}
        teamId={teamId}
      />
    );
  } catch (error) {
    console.error("Error in MemberPage:", error);
    notFound();
  }
}
