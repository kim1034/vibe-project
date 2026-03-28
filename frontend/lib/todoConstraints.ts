/** 할일 제목·메모 한도 — 서버 액션·클라이언트 폼에서 동일 값 사용 */

export const TITLE_MAX = 200;
export const MEMO_MAX = 1000;

export interface TodoDraftFields {
  title: string;
  memo: string;
  startsLocal: string;
  endsLocal: string;
}

export interface TodoDraftFieldErrors {
  titleError: string;
  memoError: string;
  periodError: string;
}

/** 클라이언트 폼용: 빈 문자열이면 해당 필드 통과 */
export function validateTodoDraftFields(
  input: TodoDraftFields,
): TodoDraftFieldErrors {
  const trimmed = input.title.trim();
  let titleError = "";
  let memoError = "";
  let periodError = "";

  if (!trimmed) {
    titleError = "제목을 입력해주세요.";
  } else if (trimmed.length > TITLE_MAX) {
    titleError = `제목은 ${TITLE_MAX}자 이내로 입력해주세요.`;
  }

  if (input.memo.length > MEMO_MAX) {
    memoError = `메모는 ${MEMO_MAX}자 이내로 입력해주세요.`;
  }

  if (input.startsLocal && input.endsLocal) {
    const a = new Date(input.startsLocal).getTime();
    const b = new Date(input.endsLocal).getTime();
    if (!Number.isNaN(a) && !Number.isNaN(b) && b < a) {
      periodError = "종료 일시는 시작 일시보다 이후여야 합니다.";
    }
  }

  return { titleError, memoError, periodError };
}

export function isTodoDraftValid(errors: TodoDraftFieldErrors): boolean {
  return (
    errors.titleError === "" &&
    errors.memoError === "" &&
    errors.periodError === ""
  );
}
