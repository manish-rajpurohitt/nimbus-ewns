import Image from "next/image";
import Link from "next/link";

interface TeamCardProps {
  id: string;
  name: string;
  description: string;
  mediaUrl: string;
  logoUrl?: string;
}

export default function TeamCard({
  id,
  name,
  description,
  mediaUrl,
  logoUrl
}: TeamCardProps) {
  return (
    <Link href={`/teams/${id}`} className="team-card">
      <Image
        src={mediaUrl}
        key={mediaUrl}
        alt={name}
        width={400}
        height={300}
        className="team-card-image"
      />
      <div className="team-card-content">
        {logoUrl && (
          <Image
            src={logoUrl}
            key={logoUrl}
            alt={`${name} logo`}
            width={70}
            height={70}
            className="team-card-logo"
          />
        )}
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </Link>
  );
}
