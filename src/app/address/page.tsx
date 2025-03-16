import { Suspense } from "react";
import { getAddresses } from "@/actions/address.actions";
import AddressList from "@/components/Address/AddressList";
import AddressFormDialog from "@/components/Address/AddressFormDialog";
import { validateAuth } from "@/utils/auth.utils";
import { redirect } from "next/navigation";

export default async function AddressPage() {
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/address");
  }

  const addresses : any = await getAddresses();
  console.log("Fetched addresses:", addresses);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Addresses</h1>
        <AddressFormDialog />
      </div>

      <Suspense fallback={<div>Loading addresses...</div>}>
        <AddressList addresses={addresses} />
      </Suspense>
    </div>
  );
}
