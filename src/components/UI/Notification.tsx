export function Notification({
  type,
  message
}: {
  type: "success" | "error";
  message: string;
}) {
  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-600" : "text-red-500";

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-md mb-4`}>
      {message}
    </div>
  );
}
