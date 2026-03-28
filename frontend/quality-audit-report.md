# Next.js 프론트엔드 품질·아키텍처 점검 리포트

- **범위**: `frontend/` 이하 (2026-03-28 기준)
- **스킬**: `nextjs-frontend-quality-audit`

| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|----------|----------|------|------|------|----------|
| 1 | High | `components/todo/TodoItem.tsx` | `TodoItem` 전체(약 390줄) | 읽기 UI·인라인 편집·삭제 다이얼로그·클라이언트 검증·토글/저장/삭제 액션이 한 컴포넌트에 집중되어 SRP 위반 및 변경 비용이 큼 | 표시용 하위 컴포넌트·편집 폼·삭제 확인·검증/액션 훅으로 분리 |
| 2 | High | `components/todo/DateTimePopoverPicker.tsx` | 기본 export 컴포넌트(약 390줄) | 포털·월 네비·일 그리드·시간 선택·오픈 상태 동기화가 단일 파일에 몰림 | 월 그리드·시간 UI·`useCallback` 네비 로직을 하위 컴포넌트/훅으로 분할 |
| 3 | Medium | `app/actions/todo.ts` | `createTodo`·`updateTodo`·`toggleTodo`·`deleteTodo` | 인증 확인·에러 반환 패턴이 액션마다 반복됨 | 인증된 사용자 조회 + 공통 실패 처리 헬퍼로 중복 제거 |
| 4 | Medium | `components/todo/AddTodoForm.tsx`, `components/todo/TodoItem.tsx` | `validateFields` / `validateEdit` | 제목·메모·기간 순서 검증이 거의 동일하게 이중 구현됨 | `lib`에 공유 검증 함수와 에러 메시지 상수로 통합 |
| 5 | Medium | `app/actions/todo.ts`, `AddTodoForm.tsx`, `TodoItem.tsx` | `TITLE_MAX` / `MEMO_MAX` | 동일 한도가 서버·클라이언트에 각각 정의되어 한쪽만 바뀔 위험 | `lib/todoConstraints.ts` 등 단일 모듈에서 export 후 양쪽 import |
| 6 | Medium | `app/actions/todo.ts` | `validateTitle` | 길이 초과 메시지에 `200`이 문자열 리터럴로 박혀 `TITLE_MAX`와 불일치 가능 | 메시지에 `${TITLE_MAX}` 사용 또는 공유 문구 함수 사용 |
| 7 | Medium | `components/todo/DateTimePopoverPicker.tsx`, `components/todo/TodoCompletionCalendar.tsx` | `WEEKDAYS`, `goPrevMonth`/`goNextMonth`, 월 라벨 | 달력 관련 상수·월 이동 로직·`Intl` 월 표기가 중복됨 | 공통 `lib`(요일 상수, 월 네비 훅, SSR 안전 포맷)로 추출 |
| 8 | Medium | `components/auth/LoginForm.tsx`, `components/auth/SignupForm.tsx` | 폼 레이아웃·submit·catch | 헤더 장식·에러·로딩·라우팅 패턴이 유사함 | `AuthFormShell` 또는 공통 훅으로 중복 축소 |
| 9 | Medium | `app/actions/auth.ts` | `mapAuthError` | `password` 포함 시 원문 `message`를 그대로 반환해 영문이 UI에 노출될 수 있음 | 알려진 패턴만 매핑하고 그 외는 일반 한국어 메시지로 통일 |
| 10 | Low | `types/todo.ts` | `Todo` | DB 스키마 정렬 `snake_case` 필드(`is_completed` 등) | 앱 레이어 네이밍 정책을 문서화하거나 경계에서만 DTO 매핑 |
| 11 | Low | `components/todo/TodoItem.tsx`, `TodoList.tsx` 등 | `import { Todo }` | 타입 전용인데 값 import 형태 | `import type { Todo }`로 정리 |
| 12 | Low | `components/dashboard/DashboardTodoClient.tsx` | `onTodoChange` 전달 | 현재 2단계 전달로 양호 | 트리가 깊어지면 Context 등으로 콜백 전파 단순화 검토 |
| 13 | Low | `lib/datetimeLocalPicker.ts` | `formatDatetimeLocalForDisplay` | `Intl` + `hour12`는 런타임에 따라 문자열이 달라질 수 있음 | 클라이언트 전용 유지 또는 `todoPeriod`와 같이 고정 한국어 포맷 검토 |

**참고**: `frontend/` 내 `.ts`/`.tsx`에서 `any` 키워드는 검색 기준 미검출.
