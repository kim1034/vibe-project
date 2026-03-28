interface EmptyStateProps {
  /** 어떤 탭에서 비었는지에 따라 문구가 달라집니다 */
  filter: "all" | "active" | "completed";
  className?: string;
}

const messages: Record<EmptyStateProps["filter"], string> = {
  all: "아직 할일이 없습니다. 위에서 새 할일을 추가해 보세요.",
  active: "진행 중인 할일이 없습니다.",
  completed: "완료된 할일이 없습니다.",
};

export default function EmptyState({
  filter,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-6 py-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <InboxIcon className="h-12 w-12 text-gray-300" aria-hidden />
      <p className="max-w-sm text-sm text-gray-500">{messages[filter]}</p>
    </div>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5h3.86a2.25 2.25 0 0 0 2.12-1.48l.647-1.946a2.25 2.25 0 0 1 2.12-1.48h4.116a2.25 2.25 0 0 1 2.12 1.48l.647 1.946a2.25 2.25 0 0 0 2.12 1.48H21.75M2.25 13.5V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.5M2.25 13.5V9.75A2.25 2.25 0 0 1 4.5 7.5h15a2.25 2.25 0 0 1 2.25 2.25v3.75"
      />
    </svg>
  );
}
