interface AuthFormChromeProps {
  title: string;
  subtitle: string;
}

/** 로그인·회원가입 폼 상단 제목·장식·부제 공통 */
export default function AuthFormChrome({
  title,
  subtitle,
}: AuthFormChromeProps) {
  return (
    <div className="mb-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      <span
        className="mx-auto mt-3 block h-1.5 w-14 rounded-full bg-[var(--color-taskly-accent)] shadow-sm"
        aria-hidden
      />
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{subtitle}</p>
    </div>
  );
}
