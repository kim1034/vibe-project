import { SkeletonCard, SkeletonLine } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div
      className="flex w-full flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">할일 목록을 불러오는 중입니다.</span>
      <section
        aria-hidden="true"
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-4">
          <SkeletonLine className="mb-3 w-full" />
          <SkeletonLine className="w-1/3" />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-1/2" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-md bg-gray-200" />
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex gap-2" role="presentation">
          <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
          <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
          <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
        </div>
        <SkeletonCard lines={3} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
      </section>
    </div>
  );
}
