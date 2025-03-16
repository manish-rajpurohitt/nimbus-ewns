import { Suspense } from "react";
import { validateAuth } from "@/utils/auth.utils";
import { getAllOrders } from "@/actions/order.actions";
import { redirect } from "next/navigation";
import OrderList from "@/components/Orders/OrderList";
import LoadingSpinner from "@/app/loading";

export default async function OrdersPage() {
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/orders");
  }

  const orders:any = await getAllOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <OrderList orders={orders || []} />
      </Suspense>
    </div>
  );
}
