import TeamCard from "./TeamCard";
import Pagination from "../common/Pagination";

interface TeamGridProps {
  businessData: any;
  teams: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

export default function TeamGrid({ teams, pagination }: TeamGridProps) {
  return (
    <section className="teams">
      <div className="teams-container">
        {teams.length > 0 ? (
          teams.map((team) => (
            <TeamCard
              key={team._id}
              id={team._id}
              name={team.name}
              description={team.description}
              mediaUrl={team.media?.[0]?.url || "/default-team.jpg"}
              logoUrl={team.logo}
            />
          ))
        ) : (
          <p>No teams available.</p>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="page-navigation">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath="/teams"
          />
        </div>
      )}
    </section>
  );
}
