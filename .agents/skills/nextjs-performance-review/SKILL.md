---
name: nextjs-performance-review
description: >-
  Reviews Next.js App Router, TypeScript, Tailwind, and Supabase code for
  runtime and delivery performance: bundle size, caching and revalidation,
  fetch patterns, Server/Client boundaries, images and fonts, list rendering,
  and high-level DB/query risks (indexes, RLS, N+1). Produces a single
  prioritized markdown table. Use when the user asks for performance tuning,
  slow pages, Lighthouse or Core Web Vitals (LCP, CLS, INP), smaller bundles,
  fewer re-renders, cache/revalidate strategy, or Supabase query efficiency.
---

# Next.js·Supabase 성능 점검

## 적용 시점

- 성능 개선, 느린 페이지·API, **Lighthouse** / **Core Web Vitals**(LCP, CLS, INP 등) 이슈를 말할 때
- 번들 축소, 캐시·`revalidate` 전략, 데이터 페칭·중복 요청 정리를 요청할 때
- DB·쿼리가 병목일 수 있다고 의심할 때(스키마 임의 변경 없이 권고만)

기본 출력은 **리포트(표)** 만 제공한다. 코드 수정은 사용자가 **명시적으로** 요청할 때만 수행한다.

## 범위

- 기본: **`frontend/`** 및 App Router **`app/`** (레이아웃·페이지·서버 액션·클라이언트 컴포넌트)
- **DB 성능**: `supabase/` 마이그레이션·RLS·인덱스·쿼리 패턴은 **이 절에서만** 언급하되, **스키마·RLS·정책을 추측으로 바꾸지 않는다**(저장소 `AGENTS.md` 및 합의된 마이그레이션 절차 준수)
- Postgres 인덱스·RLS·쿼리 플랜 등 **심화 DB 튜닝**은 `.agents/skills/supabase-postgres-best-practices/SKILL.md` 를 참고하고, 이 스킬과 **중복 서술을 최소화**한다

## 점검 축 (체크리스트)

### Next.js (App Router)

- [ ] **Server vs Client**: `"use client"` 범위가 최소인지; 큰 서브트리가 클라이언트 번들로 끌려가지 않는지
- [ ] **동적 import**: 무거운 위젯·에디터 등에 `next/dynamic`(필요 시 `ssr: false`) 검토
- [ ] **이미지·폰트**: `next/image`, 폰트 로딩 전략, 레이아웃 시프트(CLS) 유발 요소
- [ ] **라우트·데이터 캐시**: `fetch` 캐시 옵션, 세그먼트 설정과 실제 의도의 일치
- [ ] **`revalidatePath` / `revalidateTag`**: 과도한 무효화로 캐시 이점이 사라지지 않는지; 갱신 단위가 적절한지

### React (클라이언트)

- [ ] **리렌더**: 큰 목록·컨텍스트·인라인 함수/객체로 인한 불필요 렌더 가능성
- [ ] **메모이제이션**: `useMemo`/`useCallback`/`memo`는 **측정·근거** 있을 때만; 남발은 오히려 비용
- [ ] **리스트**: 안정적인 `key`, 가상화 필요 여부(대량 데이터)

### 네트워크·데이터 (Supabase 등)

- [ ] **중복 요청**: 마운트·스트릭트 모드·의존성 배열로 같은 데이터를 반복 호출하지 않는지
- [ ] **워터폴**: 서버에서 병렬로 가져올 수 있는지(`Promise.all` 등)
- [ ] **쿼리**: 필요한 컬럼만 선택(`select`), 페이지네이션·필터 인덱스와의 정합(추측으로 스키마 변경 제안 금지)

### DB (참고·고수준)

- [ ] **N+1**, 누락 인덱스 가능성, RLS로 인한 계획 복잡도 — 구체 규칙·SQL 예시는 **supabase-postgres-best-practices** 스킬 위임

## 우선순위 정의

| 우선순위 | 의미 |
|----------|------|
| **High** | 체감 지연·비용·확장성에 직결(예: 전역 무효화, 거대 클라 번들, 명백한 N+1, LCP 병목) |
| **Medium** | 누적되면 부담(중복 fetch, 과한 클라 경계, 비효율 select) |
| **Low** | 미세 최적화·측정 전 추측성 제안 |

## 출력 형식 (필수)

**마크다운 표 하나**로만 정리한다.

```markdown
| 일련번호 | 우선순위 | 영역 | 파일 또는 위치 | 문제 | 권고사항 |
|----------|----------|------|----------------|------|----------|
| 1 | High | Next | `app/...` | 한 줄 요약 | 한 줄 권고 |
```

- **영역**: `Next` / `React` / `Data` / `DB` 등 짧은 태그
- **파일 또는 위치**: 경로와 대략적 심볼(컴포넌트·함수명); 줄 번호는 필수 아님
- 행 수는 **10~25** 내에서 핵심만; 사용자 언어가 한국이면 **문제·권고**는 한국어

## 금지·주의

- 서비스 롤 키·비밀을 로그·코드·리포트에 넣지 않는다
- **스키마·RLS·마이그레이션을 추측만으로 변경 제안하지 않는다**; 필요 시 “합의 후 마이그레이션”으로만 표현
- **기본은 리포트만**; 구현은 사용자가 따로 요청할 때

## 측정 권장 (참고)

가능하면 **Lighthouse·브라우저 Performance·네트워크 탭·서버 로그** 등 근거를 표의 “문제” 열에 한 줄로 적는다. 없으면 코드 정적 분석만으로도 표를 채울 수 있다.

## AGENTS.md

이 스킬 폴더의 진입점은 본 파일(`SKILL.md`)이다.
