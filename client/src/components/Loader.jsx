import React from "react";

export default function Loader({
  fullscreen = false,
  label = "Loading",
  size = "md",
  className = "",
}) {
  const scale =
    size === "xs"
      ? "scale-[0.35]"
      : size === "sm"
        ? "scale-[0.5]"
        : size === "lg"
          ? "scale-[1.15]"
          : "scale-100";

  const container = fullscreen
    ? "loader-container bg-white/70 backdrop-blur-sm"
    : "w-full min-h-[50vh] grid place-items-center";

  return (
    <div className={`${container} ${className}`} role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-3">
        <div className={scale}>
          <div className="dots" />
        </div>
        {label ? <div className="text-sm text-gray-500">{label}</div> : null}
      </div>
    </div>
  );
}

