import { validateAuth } from "@/utils/auth.utils";
import { getAllOrders } from "@/actions/order.actions";
import { redirect } from "next/navigation";
import ProfileDashboard from "@/components/Profile/ProfileDashboard";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import RecentOrders from "@/components/Profile/RecentOrders";

export default async function ProfilePage() {
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const orders:any = await getAllOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Dashboard */}
      <ProfileDashboard user={user} orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <ProfileSidebar user={user} />
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders?.slice(0, 5) || []} />
        </div>
      </div>
    </div>
  );
}
