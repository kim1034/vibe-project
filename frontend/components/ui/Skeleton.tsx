interface SkeletonLineProps {
  width?: string;
  className?: string;
}

export function SkeletonLine({ width = "w-full", className = "" }: SkeletonLineProps) {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-gray-200 ${width} ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = "" }: SkeletonCardProps) {
  const lineWidths = ["w-3/4", "w-full", "w-5/6", "w-2/3", "w-1/2"];

  return (
    <div
      className={`rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}
      role="status"
      aria-label="로딩 중"
    >
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded bg-gray-200 ${lineWidths[i % lineWidths.length]}`}
          />
        ))}
      </div>
    </div>
  );
}
