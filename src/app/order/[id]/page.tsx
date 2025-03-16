import { Suspense } from "react";
import { validateAuth } from "@/utils/auth.utils";
import { getOrderDetails } from "@/actions/order.actions";
import { redirect } from "next/navigation";
import OrderDetails from "@/components/Orders/OrderDetails";
import LoadingSpinner from "@/app/loading";

export default async function OrderDetailPage({
  params
}: any) {
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/order/" + params.id);
  }

  const order :any = await getOrderDetails(params.id);

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
