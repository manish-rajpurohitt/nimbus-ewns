import { User, ShoppingBag, Package, Truck, History } from "lucide-react";
import { formatDate } from "@/utils/date.utils";

interface ProfileDashboardProps {
  user: any;
  orders: any[];
}

export default function ProfileDashboard({
  user,
  orders
}: ProfileDashboardProps) {
  const stats = {
    memberSince: formatDate(user.createdAt),
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter((o) => o.status === "Processing").length || 0,
    shippedOrders: orders?.filter((o) => o.status === "Shipped").length || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<User className="w-8 h-8" />}
        label="Member Since"
        value={stats.memberSince}
      />
      <StatCard
        icon={<History className="w-8 h-8" />}
        label="Total Orders"
        value={stats.totalOrders}
      />
      <StatCard
        icon={<Package className="w-8 h-8" />}
        label="Pending Orders"
        value={stats.pendingOrders}
      />
      <StatCard
        icon={<Truck className="w-8 h-8" />}
        label="Shipped Orders"
        value={stats.shippedOrders}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="text-[rgb(1,82,168)]">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
