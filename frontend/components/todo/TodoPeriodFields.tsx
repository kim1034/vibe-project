const inputClassName = `w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900
  transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25
  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`;

interface TodoPeriodFieldsProps {
  startsId: string;
  endsId: string;
  startsValue: string;
  endsValue: string;
  onStartsChange: (value: string) => void;
  onEndsChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  /** 폼 안내(추가 폼만 사용) */
  hint?: string;
}

export default function TodoPeriodFields({
  startsId,
  endsId,
  startsValue,
  endsValue,
  onStartsChange,
  onEndsChange,
  error,
  disabled = false,
  hint,
}: TodoPeriodFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      {hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={startsId} className="text-sm font-medium text-gray-800">
            시작 일시 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <input
            id={startsId}
            type="datetime-local"
            value={startsValue}
            onChange={(e) => onStartsChange(e.target.value)}
            disabled={disabled}
            className={`${inputClassName} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${startsId}-period-err` : undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={endsId} className="text-sm font-medium text-gray-800">
            종료·마감 일시 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <input
            id={endsId}
            type="datetime-local"
            value={endsValue}
            onChange={(e) => onEndsChange(e.target.value)}
            disabled={disabled}
            className={`${inputClassName} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${startsId}-period-err` : undefined}
          />
        </div>
      </div>
      {error ? (
        <p id={`${startsId}-period-err`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
