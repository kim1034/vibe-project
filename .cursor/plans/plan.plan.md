---
name: Todo App 개발 계획
overview: spec.md와 api-spec.md 기반의 Todo App을 3단계(초기 셋업 → 목업 → 실제 구현)로 나누어 개발하는 상세 실행 계획
todos:
  - id: phase-0
    content: "0단계: 프로젝트 초기 셋업 (Next.js + TS + Tailwind + Supabase 껍데기)"
    status: completed
  - id: phase-1-mock
    content: "1단계-1: Mock 데이터 및 Mock 함수 준비"
    status: completed
  - id: phase-1-ui
    content: "1단계-2: 공용 UI 컴포넌트 (Button, Input, Dialog, Skeleton)"
    status: completed
  - id: phase-1-auth
    content: "1단계-3: 인증 UI (로그인/회원가입 페이지)"
    status: completed
  - id: phase-1-layout
    content: "1단계-4: 대시보드 레이아웃 및 헤더"
    status: completed
  - id: phase-1-addform
    content: "1단계-5: 할일 추가 폼"
    status: completed
  - id: phase-1-list
    content: "1단계-6: 할일 목록 및 필터"
    status: completed
  - id: phase-1-item
    content: "1단계-7: 할일 항목 (조회/토글/수정/삭제)"
    status: completed
  - id: phase-1-assemble
    content: "1단계-8: 대시보드 메인 페이지 조립"
    status: completed
  - id: phase-1-flow
    content: "1단계-9: 루트 페이지 및 전체 플로우 검증"
    status: completed
  - id: phase-2-connect
    content: "2단계-1: Supabase 프로젝트 연결"
    status: completed
  - id: phase-2-db
    content: "2단계-2: 데이터베이스 테이블 및 RLS 생성"
    status: completed
  - id: phase-2-auth
    content: "2단계-3: 인증 구현 (Supabase Auth + 미들웨어)"
    status: completed
  - id: phase-2-actions
    content: "2단계-4: 할일 CRUD Server Actions 구현"
    status: completed
  - id: phase-2-server
    content: "2단계-5: 대시보드를 서버 컴포넌트로 전환"
    status: completed
  - id: phase-2-wire
    content: "2단계-6: 컴포넌트에서 실제 Server Action 연결"
    status: completed
  - id: phase-2-polish
    content: "2단계-7: 마무리 및 품질 개선"
    status: completed
isProject: false
---

# Todo App 개발 계획 ([plan.md](http://plan.md))

> **핵심 규칙**: 1단계(목업)가 완전히 완료·검증되기 전에는 절대 2단계(실제 구현)로 넘어가지 않는다.
> 각 섹션 완성 후 반드시 멈추고 다음 진행 여부를 사용자에게 확인받는다.

---

## 0단계: 프로젝트 초기 셋업

### 0-1. Next.js 프로젝트 생성

- `frontend/` 폴더에 Next.js App Router 프로젝트 생성 (`npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=no`)
- 불필요한 보일러플레이트 정리 (기본 page.tsx 내용 제거, globals.css 정리)

### 0-2. 프로젝트 구조 수립

- `frontend/app/` 하위 디렉터리 생성: `login/`, `signup/`, `dashboard/`, `auth/callback/`, `actions/`
- `frontend/components/` 하위 디렉터리 생성: `todo/`, `auth/`, `ui/`
- `frontend/lib/` 디렉터리 생성 (유틸리티, Supabase 클라이언트 등)
- `frontend/types/` 디렉터리 생성

### 0-3. 공통 타입 정의

- `frontend/types/todo.ts` 생성 — `Todo` 인터페이스 정의 (api-spec.md 기준)
- `frontend/types/action.ts` 생성 — `ActionResult` 타입 정의

### 0-4. Tailwind 디자인 토큰 설정

- `tailwind.config.ts`에 spec.md 색상·반응형 기준 반영 (커스텀 색상 토큰은 필요 시)
- `globals.css`에 기본 스타일 설정 (배경색 white, 폰트 등)

### 0-5. Supabase 클라이언트 사전 준비 (1단계에서는 미사용)

- `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치
- `frontend/lib/supabase/client.ts` — 브라우저 클라이언트 생성 함수 (빈 껍데기, 2단계에서 연결)
- `frontend/lib/supabase/server.ts` — 서버 클라이언트 생성 함수 (빈 껍데기, 2단계에서 연결)
- `.env.local.example` 생성 — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 템플릿

> **섹션 완료 후 멈추고 확인**

---

## 1단계: 목업 (Mock Data 기반 UI 전체 구현)

> Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용한다.
> 모든 화면을 클릭하여 플로우를 확인할 수 있는 수준으로 구현한다.

### 1-1. Mock 데이터 및 Mock 함수 준비

- `frontend/lib/mockData.ts` 생성 — 샘플 Todo 배열 (5~6개, 완료/미완료 혼합)
- `frontend/lib/mockAuth.ts` 생성 — 가짜 사용자 정보, 로그인 상태 관리 (클라이언트 상태 or localStorage)
- `frontend/lib/mockActions.ts` 생성 — `createTodo`, `updateTodo`, `toggleTodo`, `deleteTodo`, `login`, `signup`, `logout` 목 함수

> **섹션 완료 후 멈추고 확인**

### 1-2. 공용 UI 컴포넌트

- `frontend/components/ui/Button.tsx` — 기본 버튼 (variant: primary/danger/ghost, size: sm/md, disabled, loading 상태)
- `frontend/components/ui/Input.tsx` — 기본 인풋 (label, error 메시지 표시, 타입 지원)
- `frontend/components/ui/Dialog.tsx` — 확인 다이얼로그 (제목, 메시지, 확인/취소 버튼)
- `frontend/components/ui/Skeleton.tsx` — 로딩 스켈레톤 (카드형, 라인형)

> **섹션 완료 후 멈추고 확인**

### 1-3. 인증 UI (로그인 / 회원가입)

- `frontend/components/auth/LoginForm.tsx` — 이메일/비밀번호 입력, 로그인 버튼, 회원가입 링크
- `frontend/components/auth/SignupForm.tsx` — 이메일/비밀번호 입력, 가입 버튼, 로그인 링크
- `frontend/app/login/page.tsx` — LoginForm 배치, 중앙 정렬 레이아웃
- `frontend/app/signup/page.tsx` — SignupForm 배치, 중앙 정렬 레이아웃
- 로그인 성공 시 `/dashboard`로 이동 (mock: 항상 성공 또는 간단한 검증)
- 회원가입 성공 시 `/login`으로 이동

> **섹션 완료 후 멈추고 확인**

### 1-4. 대시보드 레이아웃 및 헤더

- `frontend/app/dashboard/layout.tsx` — 인증 확인 래퍼 (mock: 로그인 여부 체크 → 미인증 시 `/login` 리다이렉트)
- 대시보드 헤더 컴포넌트 — 앱 타이틀, 사용자 이메일 표시, 로그아웃 버튼
- 로그아웃 클릭 시 `/login`으로 이동

> **섹션 완료 후 멈추고 확인**

### 1-5. 할일 추가 폼

- `frontend/components/todo/AddTodoForm.tsx` — 제목 입력 (필수), 메모 입력 (선택), 추가 버튼
- 클라이언트 유효성 검증: 빈 제목 불가, 제목 200자 제한, 메모 1000자 제한
- 추가 성공 시 폼 초기화, 목록에 즉시 반영 (mock)

> **섹션 완료 후 멈추고 확인**

### 1-6. 할일 목록 및 필터

- `frontend/components/todo/TodoFilter.tsx` — 전체 / 진행중 / 완료 탭 (활성 탭 하이라이트)
- `frontend/components/todo/TodoList.tsx` — 필터링된 할일 배열을 받아 TodoItem 렌더링
- `frontend/components/todo/EmptyState.tsx` — 할일이 없을 때 안내 메시지 + 아이콘
- 필터 변경 시 목록 즉시 갱신 (클라이언트 상태)
- 생성일 기준 최신순 정렬

> **섹션 완료 후 멈추고 확인**

### 1-7. 할일 항목 (조회 / 토글 / 수정 / 삭제)

- `frontend/components/todo/TodoItem.tsx` — 카드 스타일 (rounded-lg, shadow-sm, border, hover shadow-md)
- 완료 토글: 체크박스 클릭 → `is_completed` 변경, 완료 시 취소선 + gray-400 텍스트
- 인라인 수정: 수정 버튼 클릭 → 제목/메모 편집 모드 → 저장/취소
- 삭제: 삭제 버튼 클릭 → Dialog 확인 → 삭제 처리
- 수정 시 유효성 검증 (빈 제목 불가, 글자수 제한)

> **섹션 완료 후 멈추고 확인**

### 1-8. 대시보드 메인 페이지 조립

- `frontend/app/dashboard/page.tsx` — AddTodoForm + TodoFilter + TodoList 조립
- `frontend/app/dashboard/loading.tsx` — Skeleton 기반 로딩 UI
- `frontend/app/dashboard/error.tsx` — 에러 경계 UI (재시도 버튼)
- 반응형 레이아웃: 모바일 단일 컬럼, lg: 이상 max-w-2xl 중앙 정렬

> **섹션 완료 후 멈추고 확인**

### 1-9. 루트 페이지 및 전체 플로우 리다이렉트

- `frontend/app/page.tsx` — 로그인 상태에 따라 `/dashboard` 또는 `/login` 리다이렉트
- `frontend/app/layout.tsx` — 루트 레이아웃 (폰트, 메타데이터, 글로벌 스타일)
- 전체 플로우 검증: 루트 → 로그인 → 대시보드 → 할일 CRUD → 로그아웃 → 루트

> **섹션 완료 후 멈추고 확인 — 1단계 전체 플로우 최종 검증**

---

## 2단계: 실제 구현 (Supabase 연동)

> 1단계 플로우 검증이 완료된 후에만 시작한다.
> mockData.ts를 Supabase API 호출로 교체한다.
> Supabase 작업은 Supabase MCP를 사용한다.
> Supabase 프로젝트 이름: `vibe-tutorial`

### 2-1. Supabase 프로젝트 연결

- Supabase MCP로 `vibe-tutorial` 프로젝트 정보 확인
- `.env.local`에 실제 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- `frontend/lib/supabase/client.ts` — 브라우저용 Supabase 클라이언트 구현 (`createBrowserClient`)
- `frontend/lib/supabase/server.ts` — 서버용 Supabase 클라이언트 구현 (`createServerClient`, 쿠키 핸들링)

> **섹션 완료 후 멈추고 확인**

### 2-2. 데이터베이스 테이블 생성

- Supabase MCP로 `todos` 테이블 생성 (id, user_id, title, memo, is_completed, created_at, updated_at)
- `updated_at` 자동 갱신 트리거 생성
- RLS 활성화 및 정책 설정: `SELECT`, `INSERT`, `UPDATE`, `DELETE` — `auth.uid() = user_id` 조건

> **섹션 완료 후 멈추고 확인**

### 2-3. 인증 구현 (Supabase Auth)

- `frontend/app/actions/auth.ts` — `signup` Server Action 구현 (Supabase `auth.signUp`)
- `frontend/app/actions/auth.ts` — `login` Server Action 구현 (Supabase `auth.signInWithPassword`)
- `frontend/app/actions/auth.ts` — `logout` Server Action 구현 (Supabase `auth.signOut`)
- `frontend/app/auth/callback/route.ts` — Supabase Auth 콜백 Route Handler 구현
- `frontend/middleware.ts` — 인증 미들웨어 설정 (세션 갱신, 보호 라우트 체크)
- LoginForm, SignupForm에서 mock 함수를 실제 Server Action으로 교체
- 인증 플로우 검증: 회원가입 → 로그인 → 세션 유지 → 로그아웃

> **섹션 완료 후 멈추고 확인**

### 2-4. 할일 CRUD Server Actions 구현

- `frontend/app/actions/todo.ts` — `createTodo` 구현 (세션 검증 → Supabase INSERT → revalidatePath)
- `frontend/app/actions/todo.ts` — `updateTodo` 구현 (세션 검증 → Supabase UPDATE → revalidatePath)
- `frontend/app/actions/todo.ts` — `toggleTodo` 구현 (세션 검증 → Supabase UPDATE → revalidatePath)
- `frontend/app/actions/todo.ts` — `deleteTodo` 구현 (세션 검증 → Supabase DELETE → revalidatePath)
- 모든 Action에 유효성 검증 적용 (title 빈값/200자, memo 1000자)
- 모든 Action에 에러 핸들링 적용 (ActionResult 타입 반환)

> **섹션 완료 후 멈추고 확인**

### 2-5. 대시보드를 서버 컴포넌트로 전환

- `frontend/app/dashboard/page.tsx` — 서버 컴포넌트에서 Supabase 직접 쿼리로 할일 목록 조회
- `frontend/app/dashboard/layout.tsx` — 실제 세션 기반 인증 확인으로 교체
- 대시보드 헤더에 실제 사용자 이메일 표시
- mock 의존성 제거 (mockData.ts, mockAuth.ts, mockActions.ts import 제거)

> **섹션 완료 후 멈추고 확인**

### 2-6. 컴포넌트에서 실제 Server Action 연결

- AddTodoForm — `createTodo` Server Action 연결
- TodoItem — `toggleTodo`, `updateTodo`, `deleteTodo` Server Action 연결
- 대시보드 헤더 — `logout` Server Action 연결
- 각 Action 호출 시 로딩 상태 처리 (`useFormStatus` 또는 `useTransition`)

> **섹션 완료 후 멈추고 확인**

### 2-7. 마무리 및 품질 개선

- 전체 플로우 E2E 검증: 회원가입 → 로그인 → 할일 생성 → 수정 → 토글 → 필터 → 삭제 → 로그아웃
- 에러 처리 강화: 네트워크 에러, 권한 에러 등 사용자 친화적 메시지
- 로딩 UI 최종 점검: 스켈레톤, 버튼 로딩 스피너
- 접근성 점검: 시맨틱 HTML, aria 속성, 키보드 내비게이션
- 메타데이터 설정: 페이지별 title, description
- mock 파일 정리 (mockData.ts, mockAuth.ts, mockActions.ts 삭제 또는 주석 처리)

> **섹션 완료 후 멈추고 확인 — 2단계 전체 최종 검증**

---

## 참조 파일

- 기능 명세: [spec.md](spec.md)
- API 명세: [api-spec.md](api-spec.md)
- 에이전트 규칙: [AGENTS.md](AGENTS.md)

