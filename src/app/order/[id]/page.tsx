import { Suspense } from "react";
import { validateAuth } from "@/utils/auth.utils";
import { getOrderDetails } from "@/actions/order.actions";
import { redirect } from "next/navigation";
import OrderDetails from "@/components/Orders/OrderDetails";
import LoadingSpinner from "@/app/loading";

export default async function OrderDetailPage({
  params
}: any) {
  const { id } = await params;
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/order/" + id);
  }

  const order :any = await getOrderDetails(id);

  if (!order) {
    redirect("/orders");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <OrderDetails order={order} />
      </Suspense>
    </div>
  );
}
