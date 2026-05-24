type ToastProps = {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
};

export default function Toast({
  message,
  type = "success",
  isVisible,
}: ToastProps) {
  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-emerald-600"
      : "bg-red-600";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`px-4 py-3 text-white rounded-lg shadow-lg ${bgColor}`}
      >
        {message}
      </div>
    </div>
  );
}