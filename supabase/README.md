# Supabase 마이그레이션 (할일 앱)

이 폴더의 SQL은 **원격 Supabase 프로젝트**에 적용되어야 합니다. 적용되지 않으면 앱의 `createTodo` 등이 `starts_at` / `ends_at` / `completed_at` 컬럼을 쓸 때 실패하고, UI에는「저장할 수 없습니다. Supabase에 최신 마이그레이션이 적용됐는지 확인해주세요.」가 나올 수 있습니다.

## 마이그레이션 파일 순서

| 파일 | 내용 |
|------|------|
| `20250327120000_create_todos_table_rls.sql` | `todos` 테이블·RLS |
| `20250328120000_todos_completed_at.sql` | `completed_at` 컬럼 |
| `20250328200000_todos_starts_ends_at.sql` | `starts_at`, `ends_at`, 기간 CHECK |

**항상 위 시간순(파일명 순)으로** 모두 적용합니다.

---

## 방법 A: Supabase CLI (권장)

1. [Supabase CLI](https://supabase.com/docs/guides/cli) 설치 후 로그인: `supabase login`
2. 저장소 루트(`supabase/migrations`가 보이는 위치)에서 프로젝트 연결:  
   `supabase link --project-ref <프로젝트 ref>`  
   - 대시보드 **Project Settings → General → Reference ID** 또는 URL `https://<ref>.supabase.co`의 `<ref>`가 ref입니다.
3. 로컬에 `supabase/config.toml`이 없으면 같은 루트에서 `supabase init`으로 생성한 뒤, 위 `link`를 진행합니다. (기존 `migrations` 폴더는 유지합니다.)
4. 원격 DB에 반영: `supabase db push`  
   - 로컬에만 있고 원격 `schema_migrations`에 없는 마이그레이션이 순서대로 적용됩니다.

배포·협업 시에는 **어느 Supabase 프로젝트에 `db push` 했는지**가 곧 앱이 붙는 DB와 같아야 합니다 (`frontend/.env.local` 체크리스트 참고).

---

## 방법 B: 대시보드 SQL Editor

CLI 없이 적용할 때:

1. [Supabase Dashboard](https://supabase.com/dashboard) → 해당 프로젝트 → **SQL Editor**
2. 위 세 파일을 **파일명 순서대로** 열어 내용 전체를 복사해 실행합니다.
3. 이미 일부만 적용된 상태라면, 에러 나는 구문만 건너뛰지 말고 **어떤 마이그레이션까지 적용됐는지** 확인한 뒤 필요한 파일만 안전하게 실행합니다. (`IF NOT EXISTS` 등이 있어도 순서는 지키는 것이 좋습니다.)

---

## 프론트 `.env`와 같은 프로젝트인지 확인

`frontend/.env.local.example`에 적어 둔 체크리스트와 같이, **URL·anon 키가 마이그레이션을 적용한 그 프로젝트**와 일치하는지 반드시 맞춥니다.

---

## 개발 시 실제 에러 확인

Next.js 개발 서버를 띄운 터미널에서 `[todo:createTodo]` 등으로 검색하면, 서버 액션이 Supabase 원본 `code`·`message`를 로그로 남깁니다. UI 문구로는 가려지므로, 원인이 컬럼 누락인지 RLS인지 구분할 때 유용합니다.
