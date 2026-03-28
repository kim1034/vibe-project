# Todo App — 프로젝트 명세

## 1. 프로젝트 개요

할일(Todo)을 생성·관리·추적할 수 있는 웹 애플리케이션.
사용자 인증 기반으로 개인 할일 목록을 관리하며, 직관적이고 반응형인 UI를 제공한다.

대상 사용자: 간단한 할일 관리가 필요한 개인 사용자.

---

## 2. 기술 스택

| 영역 | 기술 | 역할 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 라우팅·SSR·서버 컴포넌트·Server Actions |
| 언어 | TypeScript | 정적 타입 안전성 |
| 스타일 | Tailwind CSS | 유틸리티 기반 반응형 UI |
| 데이터베이스 | Supabase (PostgreSQL) | 할일 데이터 저장 |
| 인증 | Supabase Auth | 이메일/비밀번호 인증·세션 관리 |
| 상태 관리 | React Server Components + 클라이언트 상태 최소화 | 서버 중심 데이터 흐름 |
| 배포 | Vercel (권장) | 프로덕션 호스팅 |

---

## 3. MVP 기능 목록 (v1.0)

### 인증

- [ ] 이메일/비밀번호 회원가입
- [ ] 이메일/비밀번호 로그인 / 로그아웃
- [ ] 로그인 상태 유지 (세션 관리)
- [ ] 비로그인 사용자는 로그인 페이지로 리다이렉트

### 할일 CRUD

- [ ] 할일 생성 (제목 필수, 메모 선택)
- [ ] 할일 목록 조회 (본인 것만)
- [ ] 할일 수정 (제목, 메모)
- [ ] 할일 삭제
- [ ] 할일 완료/미완료 토글

### 목록 & 필터

- [ ] 전체 / 진행중 / 완료 필터 탭
- [ ] 생성일 기준 정렬 (최신순 기본)

### UI/UX

- [ ] 반응형 레이아웃 (모바일 우선)
- [ ] 빈 상태(Empty State) 안내 메시지
- [ ] 할일 완료 시 시각적 피드백 (취소선, 색상 변화)
- [ ] 로딩 스켈레톤 / 스피너
- [ ] 삭제 확인 다이얼로그

---

## 4. 확장 기능 (v2.0)

- 소셜 로그인 (Google, GitHub)
- 할일 마감일(due date) 설정 및 달력 뷰
- 우선순위 (높음/중간/낮음) 라벨
- 카테고리/태그 분류
- 드래그 앤 드롭 순서 변경
- 검색 기능
- 다크 모드

---

## 5. 데이터베이스 스키마

### `todos` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `uuid` PK, default `gen_random_uuid()` | 고유 식별자 |
| `user_id` | `uuid` FK → `auth.users.id` ON DELETE CASCADE | 소유자 |
| `title` | `text` NOT NULL | 할일 제목 |
| `memo` | `text` | 상세 메모 (선택) |
| `is_completed` | `boolean` default `false` | 완료 여부 |
| `created_at` | `timestamptz` default `now()` | 생성 시각 |
| `updated_at` | `timestamptz` default `now()` | 수정 시각 |

### 트리거

`updated_at` 컬럼은 행이 수정될 때마다 `now()`로 자동 갱신되도록 트리거를 설정한다.

---

## 6. 페이지 구조 (App Router)

| 경로 | 설명 |
|------|------|
| `/` | 로그인 여부에 따라 `/dashboard` 또는 `/login`으로 리다이렉트 |
| `/login` | 로그인 페이지 |
| `/signup` | 회원가입 페이지 |
| `/dashboard` | 할일 목록 메인 (인증 필요) |
| `/auth/callback` | Supabase Auth 콜백 처리 |

### 디렉터리 트리

```
app/
├── layout.tsx              # 루트 레이아웃 (폰트, 글로벌 스타일)
├── page.tsx                # / → 리다이렉트 로직
├── login/
│   └── page.tsx            # 로그인 폼
├── signup/
│   └── page.tsx            # 회원가입 폼
├── dashboard/
│   ├── layout.tsx          # 인증 확인 레이아웃
│   ├── page.tsx            # 할일 목록
│   ├── loading.tsx         # 로딩 스켈레톤
│   └── error.tsx           # 에러 경계
├── auth/
│   └── callback/
│       └── route.ts        # Supabase Auth 콜백 Route Handler
└── actions/
    └── todo.ts             # Server Actions
```

---

## 7. 주요 컴포넌트 목록

```
components/
├── todo/
│   ├── TodoList.tsx        # 할일 목록 렌더링
│   ├── TodoItem.tsx        # 개별 할일 항목 (토글, 수정, 삭제)
│   ├── AddTodoForm.tsx     # 할일 추가 폼
│   ├── TodoFilter.tsx      # 전체/진행중/완료 필터 탭
│   └── EmptyState.tsx      # 할일이 없을 때 안내
├── auth/
│   ├── LoginForm.tsx       # 로그인 폼
│   └── SignupForm.tsx      # 회원가입 폼
└── ui/
    ├── Button.tsx          # 공용 버튼
    ├── Input.tsx           # 공용 인풋
    ├── Dialog.tsx          # 확인 다이얼로그 (삭제 등)
    └── Skeleton.tsx        # 로딩 스켈레톤
```

---

## 8. Server Actions

파일: `app/actions/todo.ts`

| 함수 | 파라미터 | 역할 |
|------|----------|------|
| `createTodo` | `title: string, memo?: string` | 새 할일 생성, `user_id`는 세션에서 자동 추출 |
| `updateTodo` | `id: string, title: string, memo?: string` | 할일 제목·메모 수정 |
| `toggleTodo` | `id: string, is_completed: boolean` | 완료/미완료 상태 토글 |
| `deleteTodo` | `id: string` | 할일 삭제 |

모든 액션은 세션 유효성 검증 후 실행하며, `revalidatePath('/dashboard')`로 캐시를 갱신한다.

---

## 9. UI 디자인 가이드

### 색상

| 용도 | 값 |
|------|-----|
| 배경 | 화이트 (`#FFFFFF`) |
| 포인트 | 인디고 (`indigo-600` ~ `indigo-700`) |
| 보조 포인트 | 블루 (`blue-500`) |
| 텍스트 | 그레이 (`gray-900` 본문, `gray-500` 보조) |
| 완료 항목 | 그레이 (`gray-400`, 취소선) |
| 위험 동작 | 레드 (`red-500`, 삭제 버튼) |

### 카드 스타일

- `rounded-lg`, `shadow-sm`, `border border-gray-200`
- 호버 시 `shadow-md` 전환

### 반응형 기준

| 브레이크포인트 | 너비 |
|---------------|------|
| 모바일 | 375px ~ |
| 태블릿 | 768px ~ (`md:`) |
| 데스크톱 | 1024px ~ (`lg:`) |
| 와이드 | 1440px ~ (`xl:`) |

레이아웃: 모바일에서 단일 컬럼, `lg:` 이상에서 최대 너비 `max-w-2xl` 중앙 정렬.

---

## 10. 구현 단계

| 단계 | 제목 | 설명 |
|------|------|------|
| 1 | 프로젝트 초기 설정 | Next.js 생성, Supabase 클라이언트 구성, 인증 미들웨어 설정 |
| 2 | 데이터베이스 & 인증 설정 | todos 테이블 생성, TypeScript 타입 생성 (RLS는 추후 수동 적용) |
| 3 | 인증 UI | 로그인/회원가입 페이지, Auth 콜백 처리, 리다이렉트 로직 |
| 4 | 할일 목록 페이지 | 서버 컴포넌트로 목록 조회, 필터 탭 구현 |
| 5 | 할일 생성 & 수정 | Server Actions 연결, Optimistic UI 적용 |
| 6 | Server Actions 정리 | 에러 핸들링 강화, 캐시 갱신 패턴 통일 |
| 7 | 마무리 & 품질 개선 | 로딩/에러 UI, 접근성 점검, 메타데이터 설정 |
