# Next.js·Supabase 성능 점검 리포트

- **범위**: `frontend/` · App Router `app/` (정적 분석 기준, Lighthouse 미실행)
- **스킬**: `nextjs-performance-review`
- **참고**: Postgres 심화 튜닝은 `.agents/skills/supabase-postgres-best-practices/SKILL.md` 위임

| 일련번호 | 우선순위 | 영역 | 파일 또는 위치 | 문제 | 권고사항 |
|----------|----------|------|----------------|------|----------|
| 1 | Medium | Data | `app/dashboard/page.tsx` · `DashboardPage` | `from("todos").select("*")`로 전 컬럼을 내려받아 직렬화·전달 비용이 커질 수 있음 | `Todo`에 필요한 컬럼만 명시 `select`로 페이로드 축소(목록 규모 커질수록 유리) |
| 2 | Medium | Next | `components/dashboard/DashboardTodoClient.tsx` · `refresh` | 토글·수정·삭제마다 `router.refresh()`로 대시보드 RSC·서버 데이터 전체 재실행 | 낙관적 UI·로컬 상태 또는 필드 단위 갱신, 필요 시 `revalidateTag` 등 무효화 범위 축소 검토 |
| 3 | Medium | Next | `app/actions/auth.ts` · `login`/`signup`/`logout` | `revalidatePath("/", "layout")`로 루트 레이아웃 캐시를 넓게 무효화 | 실제로 갱신이 필요한 세그먼트·경로만 무효화해 불필요한 전역 리빌드 완화 |
| 4 | Medium | React | `DashboardTodoClient` 및 하위 할일 트리 | 대시보드 본문이 클라이언트 서브트리로 묶여 상호작용 컴포넌트가 초기 JS에 포함 | 정적 영역은 서버 컴포넌트에 두고, 달력·폼 등 무거운 조각만 `next/dynamic` 분리 검토 |
| 5 | Low | React | `components/todo/DateTimePopoverPicker.tsx` | 포털·달력·시간 UI가 기본 번들에 포함되어 초기 다운로드 증가 가능 | 사용 시점에만 로드되도록 `dynamic(..., { ssr: false })` 등 지연 로드 검토 |
| 6 | Low | Data | `components/todo/TodoCompletionCalendar.tsx` | 렌더마다 `todos` 전체를 순회해 월별 완료 수 집계(`useMemo`) | 할일 수가 매우 많아지면 서버 집계 API·또는 월·연도 범위로 데이터 제한 검토 |
| 7 | Low | React | `components/todo/TodoList.tsx` · `TodoItem` 맵 | 모든 항목을 한 번에 DOM에 렌더 | 수백 건 이상이면 페이지네이션·가상 스크롤로 메인 스레드·레이아웃 비용 완화 |
| 8 | Low | Next | `app/dashboard/page.tsx` | 인증 확인 후 `user.id`가 있어야 목록 조회 가능해 순차 `await`는 필수에 가깝음 | 다른 독립 데이터가 생기면 `Promise.all`로 병렬화 가능 여부 점검 |
| 9 | Low | Next | `app/layout.tsx` | `next/font`(Geist) 사용은 CLS 완화에 유리 | 향후 이미지 추가 시 `next/image`·명시적 `width`/`height`로 LCP·CLS 관리 |
| 10 | Low | Next | `middleware.ts` | 요청마다 Edge에서 미들웨어 실행 | matcher에서 제외 경로를 유지·필요 시 더 좁혀 Edge CPU 시간 절감 |
| 11 | Low | DB | `supabase/migrations/...create_todos_table_rls.sql` | `idx_todos_user_created (user_id, created_at DESC)`가 대시보드 `order("created_at")`와 정합 | 정렬·필터 요구가 바뀌면 인덱스와 쿼리를 함께 재검토(상세는 supabase-postgres-best-practices) |
| 12 | Low | Next | `app/actions/todo.ts` | 할일 변경 시 `revalidatePath("/dashboard")`만 호출해 범위는 상대적으로 좁음 | 라우트 세그먼트가 늘면 `revalidateTag`와 태그 전략으로 세분화 여지 |

**비고**: 실제 LCP·INP·번들 크기는 프로덕션 빌드 + Lighthouse/웹 바이탈 측정으로 검증하는 것이 좋습니다.
