# Todo App — API 명세

이 문서는 프론트엔드(컴포넌트)와 백엔드(Server Actions · Supabase) 사이에서
**어떤 데이터를 주고받는지**를 정리한 것입니다.

> 이 프로젝트는 Next.js **Server Actions**를 사용하므로,
> 전통적인 REST API 엔드포인트(`/api/...`) 대신 **함수 호출** 형태로 통신합니다.
> 프론트엔드가 Server Action 함수를 호출하면 → 서버에서 실행 → 결과를 돌려주는 구조입니다.

---

## 공통 타입

### Todo

```typescript
interface Todo {
  id: string;           // uuid
  user_id: string;      // uuid — 소유자
  title: string;        // 할일 제목
  memo: string | null;  // 상세 메모 (없으면 null)
  is_completed: boolean; // 완료 여부
  created_at: string;   // ISO 8601 타임스탬프
  updated_at: string;   // ISO 8601 타임스탬프
}
```

### ActionResult (Server Action 공통 반환)

```typescript
type ActionResult =
  | { success: true }
  | { success: false; error: string };
```

---

## 1. 인증

### 1-1. 회원가입

| 항목 | 내용 |
|------|------|
| 호출 위치 | `SignupForm` → Server Action `signup` |
| 파일 | `app/actions/auth.ts` |

**보내는 데이터 (프론트 → 서버)**

```typescript
{
  email: "user@example.com",
  password: "mypassword123"
}
```

**받는 데이터 (서버 → 프론트)**

```typescript
// 성공 — 이메일 확인 안내 또는 바로 로그인
{ success: true }

// 실패
{ success: false, error: "이미 가입된 이메일입니다." }
```

---

### 1-2. 로그인

| 항목 | 내용 |
|------|------|
| 호출 위치 | `LoginForm` → Server Action `login` |
| 파일 | `app/actions/auth.ts` |

**보내는 데이터**

```typescript
{
  email: "user@example.com",
  password: "mypassword123"
}
```

**받는 데이터**

```typescript
// 성공 — /dashboard로 리다이렉트
{ success: true }

// 실패
{ success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
```

---

### 1-3. 로그아웃

| 항목 | 내용 |
|------|------|
| 호출 위치 | 대시보드 헤더 로그아웃 버튼 → Server Action `logout` |
| 파일 | `app/actions/auth.ts` |

**보내는 데이터**

없음 (세션 쿠키가 자동으로 전달됨)

**받는 데이터**

```typescript
// 성공 — /login으로 리다이렉트
{ success: true }
```

---

## 2. 할일 CRUD

### 2-1. 할일 목록 조회

| 항목 | 내용 |
|------|------|
| 호출 위치 | `dashboard/page.tsx` (서버 컴포넌트에서 직접 조회) |
| 방식 | Server Action이 아니라 **서버 컴포넌트 안에서 Supabase 직접 쿼리** |

**Supabase 쿼리 (서버 → DB)**

```typescript
const { data, error } = await supabase
  .from("todos")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });
```

**컴포넌트가 받는 데이터 (DB → 서버 → 프론트)**

```typescript
// 할일이 있을 때
[
  {
    id: "a1b2c3d4-...",
    user_id: "u1v2w3x4-...",
    title: "Next.js 공부하기",
    memo: "App Router 문서 읽기",
    is_completed: false,
    created_at: "2026-03-27T10:00:00Z",
    updated_at: "2026-03-27T10:00:00Z"
  },
  {
    id: "e5f6g7h8-...",
    user_id: "u1v2w3x4-...",
    title: "장보기",
    memo: null,
    is_completed: true,
    created_at: "2026-03-26T08:30:00Z",
    updated_at: "2026-03-26T15:00:00Z"
  }
]

// 할일이 없을 때
[]
```

---

### 2-2. 할일 생성

| 항목 | 내용 |
|------|------|
| 호출 위치 | `AddTodoForm` → Server Action `createTodo` |
| 파일 | `app/actions/todo.ts` |

**보내는 데이터 (프론트 → 서버)**

```typescript
{
  title: "TypeScript 복습하기",
  memo: "제네릭 부분 다시 보기"   // 선택 — 없으면 생략
}
```

**받는 데이터 (서버 → 프론트)**

```typescript
// 성공 — 목록이 자동으로 새로고침됨 (revalidatePath)
{ success: true }

// 실패
{ success: false, error: "제목을 입력해주세요." }
```

**서버 내부 동작 (Supabase INSERT)**

```typescript
await supabase.from("todos").insert({
  user_id: user.id,       // 세션에서 자동 추출
  title: "TypeScript 복습하기",
  memo: "제네릭 부분 다시 보기"
});
```

---

### 2-3. 할일 수정

| 항목 | 내용 |
|------|------|
| 호출 위치 | `TodoItem` (수정 모드) → Server Action `updateTodo` |
| 파일 | `app/actions/todo.ts` |

**보내는 데이터**

```typescript
{
  id: "a1b2c3d4-...",
  title: "Next.js 공부하기 (수정)",
  memo: "App Router + Server Actions 문서"
}
```

**받는 데이터**

```typescript
{ success: true }
// 또는
{ success: false, error: "수정 권한이 없습니다." }
```

**서버 내부 동작 (Supabase UPDATE)**

```typescript
await supabase.from("todos")
  .update({ title, memo })
  .eq("id", id)
  .eq("user_id", user.id);
```

---

### 2-4. 할일 완료/미완료 토글

| 항목 | 내용 |
|------|------|
| 호출 위치 | `TodoItem` 체크박스 → Server Action `toggleTodo` |
| 파일 | `app/actions/todo.ts` |

**보내는 데이터**

```typescript
{
  id: "a1b2c3d4-...",
  is_completed: true    // 현재 false → true로 토글
}
```

**받는 데이터**

```typescript
{ success: true }
```

**서버 내부 동작 (Supabase UPDATE)**

```typescript
await supabase.from("todos")
  .update({ is_completed })
  .eq("id", id)
  .eq("user_id", user.id);
```

---

### 2-5. 할일 삭제

| 항목 | 내용 |
|------|------|
| 호출 위치 | `TodoItem` 삭제 버튼 → 확인 다이얼로그 → Server Action `deleteTodo` |
| 파일 | `app/actions/todo.ts` |

**보내는 데이터**

```typescript
{
  id: "a1b2c3d4-..."
}
```

**받는 데이터**

```typescript
{ success: true }
// 또는
{ success: false, error: "삭제에 실패했습니다." }
```

**서버 내부 동작 (Supabase DELETE)**

```typescript
await supabase.from("todos")
  .delete()
  .eq("id", id)
  .eq("user_id", user.id);
```

---

## 3. 필터링 (클라이언트 처리)

필터는 **Server Action 호출 없이** 프론트엔드에서 처리합니다.
서버 컴포넌트가 전체 목록을 가져온 뒤, `TodoFilter`가 URL 쿼리 파라미터나 클라이언트 상태로 필터링합니다.

| 필터 | 조건 |
|------|------|
| 전체 | 모든 항목 표시 |
| 진행중 | `is_completed === false` |
| 완료 | `is_completed === true` |

```typescript
// 예: 클라이언트에서 필터 적용
const filtered = todos.filter((todo) => {
  if (filter === "active") return !todo.is_completed;
  if (filter === "completed") return todo.is_completed;
  return true; // "all"
});
```

---

## 4. 데이터 흐름 요약

```
사용자 조작
    ↓
컴포넌트 (프론트엔드)
    ↓ Server Action 함수 호출
서버 (Next.js Server Action)
    ↓ Supabase 클라이언트로 쿼리
데이터베이스 (Supabase PostgreSQL)
    ↓ 결과 반환
서버 → revalidatePath → 프론트엔드 자동 갱신
```

| 동작 | 프론트 → 서버 | 서버 → DB | 서버 → 프론트 |
|------|--------------|-----------|--------------|
| 목록 조회 | (서버 컴포넌트 직접) | `SELECT * WHERE user_id` | `Todo[]` |
| 생성 | `{ title, memo? }` | `INSERT` | `{ success }` |
| 수정 | `{ id, title, memo? }` | `UPDATE` | `{ success }` |
| 토글 | `{ id, is_completed }` | `UPDATE` | `{ success }` |
| 삭제 | `{ id }` | `DELETE` | `{ success }` |
| 회원가입 | `{ email, password }` | Supabase Auth | `{ success }` |
| 로그인 | `{ email, password }` | Supabase Auth | `{ success }` |
| 로그아웃 | (없음) | Supabase Auth | `{ success }` |

---

## 5. 유효성 검증 규칙

| 필드 | 규칙 | 에러 메시지 예시 |
|------|------|-----------------|
| `title` | 빈 문자열 불가, 최대 200자 | "제목을 입력해주세요." / "제목은 200자 이내로 입력해주세요." |
| `memo` | 선택, 최대 1000자 | "메모는 1000자 이내로 입력해주세요." |
| `email` | 이메일 형식 필수 | "올바른 이메일 주소를 입력해주세요." |
| `password` | 최소 6자 | "비밀번호는 6자 이상이어야 합니다." |

유효성 검증은 **서버(Server Action)에서 반드시** 수행하고,
UX를 위해 **프론트(폼)에서도** 동일 규칙을 적용한다.
