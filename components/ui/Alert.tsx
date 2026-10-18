import React from "react";

interface AlertMessageProps {
  message: string;
  className?: string;
  variant?: "default" | "error";
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  className = "",
  variant = "default",
}) => {
  const baseClasses = "w-full flex items-center gap-3 rounded-lg px-4 py-3";

  const variantClasses =
    variant === "error"
      ? "border border-red-200 bg-red-50 text-red-900"
      : "border border-teal-200 bg-teal-50 text-teal-900";

  const iconClasses =
    variant === "error" ? "bg-red-600 text-white" : "bg-teal-600 text-white";

  return (
    <div
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${iconClasses}`}
      >
        i
      </span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default AlertMessage;
