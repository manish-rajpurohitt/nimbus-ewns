import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Team } from "@/types/team.types";
import Pagination from "../common/Pagination";

interface TeamDetailsProps {
  teamData: Team;
  businessData?: any;
  currentPage: number;
}

export default function TeamDetails({
  teamData,
  currentPage,
  businessData
}: TeamDetailsProps) {
  if (!teamData) return null;

  const membersPerPage = 3;
  const totalPages = Math.ceil(
    (teamData.members?.length || 0) / membersPerPage
  );

  // Calculate the members to show on current page
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = teamData.members?.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const staticData = businessData.staticData?.teams?.members;

  return (
    <div className="team-detail-page">
      <div className="team-banner" style={{
        backgroundImage: `url(${'"'+staticData?.bannerUrl + '"'|| 'https://t4.ftcdn.net/jpg/06/52/48/93/360_F_652489397_e54E2mUvjI4RLIU4dKgmH0pgfvOzJqKM.jpg'})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}>
        <div className="team-banner-overlay">
          <div className="banner-content-team">
            <h1>{teamData.name}</h1>
            {teamData.slogan && <p>{teamData.slogan}</p>}
          </div>
        </div>
      </div>

      <div className="team-content">
        <section className="members-section">
          <div className="membersHead">
            <div className="subheading">Team Members</div>
            <Link href="/teams" className="back-button">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="members-grid">
            {currentMembers?.map((member) => (
              <Link
                key={member._id}
                href={`/teams/${teamData._id}/member/${member._id}`}
                className="member-card"
              >
                <div className="member-image-wrapper">
                  <div className="relative h-64 w-full">
                    <Image
                      src={member.media?.[0]?.url || "/default-member.jpg"}
                      key={member.media?.[0]?.url || "/default-member.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="member-overlay">
                    <button className="view-profile-btn">View Profile</button>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.designation}</p>
                  <div className="member-details">
                    {member.expertise && member.expertise.length > 0 && (
                      <span>
                        <span className="member-icon">★</span>
                        {member.expertise[0]}
                      </span>
                    )}
                    {member.experience && (
                      <span>
                        <span className="member-icon">📅</span>
                        {member.experience} years
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/teams/${teamData._id}`}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
