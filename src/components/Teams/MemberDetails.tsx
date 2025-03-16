import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import type { TeamMember } from "@/types/team.types";

interface MemberDetailsProps {
  memberData: TeamMember;
  teamId: string;
  businessData: any;
}

export default function MemberDetails({
  memberData,
  teamId
}: MemberDetailsProps) {
  if (!memberData) return null;

  return (
    <div className="teammemberbanner">
      <div className="expert-detail-page">
        {/* <div className="back-button-container">
          <Link href={`/teams/${teamId}`} className="back-button">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div> */}

        <div className="expert-card">
          <div className="card-header">
            <div className="relative w-[180px] h-[180px]">
              <Image
                src={memberData.media?.[0]?.url || "/default-member.jpg"}
                alt={memberData.name}
                fill
                className="card-image object-cover"
                sizes="180px"
              />
            </div>
            <div className="card-info">
              <h1>{memberData.name}</h1>
              <h2>{memberData.designation}</h2>
            </div>
          </div>

          <div className="card-content">
            {memberData.description && (
              <p className="card-description">{memberData.description}</p>
            )}

            <div className="contact-info-Expert">
              {memberData.email && (
                <div className="contact-item-Expert">
                  <Mail className="w-5 h-5" />
                  <a
                    href={`mailto:${memberData.email}`}
                    className="contact-link"
                  >
                    {memberData.email}
                  </a>
                </div>
              )}

              {memberData.phone && (
                <div className="contact-item-Expert">
                  <Phone className="w-5 h-5" />
                  <a href={`tel:${memberData.phone}`} className="contact-link">
                    {memberData.phone}
                  </a>
                </div>
              )}

              {memberData.links && memberData.links.length > 0 && (
                <div className="social-links">
                  {memberData.links.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <Image
                        src={link.logo}
                        alt={link.title}
                        width={24}
                        height={24}
                        className="social-icon"
                      />
                      {/* <span>{link.title}</span> */}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
