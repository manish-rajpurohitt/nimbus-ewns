"use client";

import { useState } from "react";
import { Home, Star, MapPin, Phone, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteAddress, setDefaultAddress } from "@/actions/address.actions";
import { toast } from "sonner";
import type { Address } from "@/types/address.types";

export default function AddressList({ addresses }: { addresses: any[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  console.log("Rendering addresses:", addresses);

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setIsDeleting(addressId);
    try {
      console.log("Deleting address:", addressId);
      const result : any = await deleteAddress(addressId);
      console.log("Delete result:", result);

      if (result.success) {
        toast.success("Address deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete address");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const result = await setDefaultAddress(addressId);
      if (result.success) {
        toast.success("Default address updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update default address");
      }
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No addresses found. Add your first address.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`bg-white p-6 rounded-lg shadow-md relative ${
            addr.isDefault ? "border-2 border-blue-500" : ""
          }`}
        >
          {addr.isDefault && (
            <span className="absolute top-2 right-2 text-blue-500">
              <Star className="w-5 h-5 fill-current" />
            </span>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-semibold">{addr.name}</h3>
                <p className="text-gray-600 text-sm">
                  {addr.addressLine1}
                  {addr.addressLine2 && <>, {addr.addressLine2}</>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <p className="text-gray-600 text-sm">
                {addr.city}, {addr.state} {addr.pincode}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <p className="text-gray-600 text-sm">{addr.phoneNumber}</p>
            </div>

            {addr.landmark && (
              <p className="text-sm text-gray-500 mt-2">
                Landmark: {addr.landmark}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => router.push(`/address/edit/${addr._id}`)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                disabled={isDeleting === addr._id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
