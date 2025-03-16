import Link from "next/link";
import { Mail, Phone, MapPin, Settings } from "lucide-react";

export default function ProfileSidebar({ user }: { user: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Link
          href="/profile/settings"
          className="text-gray-500 hover:text-gray-700"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <div className="space-y-6">
        {/* Name Section */}
        <InfoField
          label="Full Name"
          value={user.fullName}
          editLink="/profile/edit"
        />

        {/* Email Section */}
        <InfoField
          label="Email Address"
          value={user.email}
          icon={<Mail className="w-5 h-5" />}
          verified={user.emailVerified}
        />

        {/* Phone Section */}
        <InfoField
          label="Phone Number"
          value={user.phone || "Not added"}
          icon={<Phone className="w-5 h-5" />}
          action={user.phone ? "Change" : "Add"}
          actionLink="/profile/phone"
        />

        {/* Address Section */}
        <InfoField
          label="Default Address"
          value={user.defaultAddress?.addressLine1 || "No default address"}
          icon={<MapPin className="w-5 h-5" />}
          action="Manage"
          actionLink="/address"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <Link
          href="/profile/edit"
          className="w-full bg-[rgb(1,82,168)] text-white py-2 px-4 rounded-md hover:bg-[rgb(3,48,97)] text-center"
        >
          Update Profile
        </Link>
        <Link
          href="/orders"
          className="w-full border border-[rgb(1,82,168)] text-[rgb(1,82,168)] py-2 px-4 rounded-md hover:bg-[rgb(1,82,168)]/5 text-center"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
  verified,
  action,
  actionLink,
  editLink
}: any) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span>{value}</span>
          {verified && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>
        {(action || editLink) && (
          <Link
            href={actionLink || editLink || "#"}
            className="text-sm text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
          >
            {action || "Edit"}
          </Link>
        )}
      </div>
    </div>
  );
}
