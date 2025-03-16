import { Home, Star, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface AddressListProps {
  addresses: any[];
  selectedAddress?: string;
  onSelect: (id: string) => void;
}

export default function AddressList({
  addresses,
  selectedAddress,
  onSelect
}: AddressListProps) {
  if (!addresses.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 mb-4">No addresses found</p>
        <Link
          href="/address"
          className="text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
        >
          Add a new address
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedAddress === addr._id
              ? "border-[rgb(1,82,168)] bg-[rgb(1,82,168)]/5"
              : "border-gray-200 hover:border-[rgb(1,82,168)]"
          }`}
          onClick={() => onSelect(addr._id)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{addr.name}</h3>
                {addr.isDefault && (
                  <span className="text-xs bg-[rgb(1,82,168)]/10 text-[rgb(1,82,168)] px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {addr.addressLine1}
                {addr.addressLine2 && <>, {addr.addressLine2}</>}
              </p>
              <p className="text-gray-600 text-sm">
                {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="text-gray-600 text-sm">{addr.phoneNumber}</p>
            </div>
          </div>
        </div>
      ))}

      <Link
        href="/address"
        className="block text-center text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)] mt-4"
      >
        Add New Address
      </Link>
    </div>
  );
}
