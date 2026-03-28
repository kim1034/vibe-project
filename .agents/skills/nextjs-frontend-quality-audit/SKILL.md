---
name: nextjs-frontend-quality-audit
description: >-
  Audits Next.js + TypeScript frontend folders for duplication, oversized
  components/functions, weak types, naming drift, and unnecessary coupling.
  Delivers a prioritized markdown table (High/Medium/Low). Use when the user
  asks for a frontend architecture review, code quality audit, technical debt
  scan, or inspection of components under frontend/ or app/.
---

# Next.js 프론트엔드 품질·아키텍처 점검

## 적용 시점

- `frontend/`(또는 지정한 앱 디렉터리) 전반 점검을 요청할 때
- 리팩터링 전 기술 부채 목록이 필요할 때
- PR·스프린트 단위로 구조·일관성을 검토할 때

코드 수정은 **요청이 있을 때만** 수행하고, 기본 출력은 **리포트(표)** 만 제공한다.

## 점검 축 (필수)

1. **코드 중복** — 동일·유사 로직이 여러 파일에 흩어져 있는지
2. **함수·컴포넌트 크기** — 약 50줄 초과·단일 책임(SRP) 위반 여부
3. **타입** — `any`, 과도한 `unknown`, 누락된 인터페이스, 원문 에러 문자열 노출
4. **네이밍** — 함수·변수·파일명 컨벤션(DB snake_case vs TS camelCase 등) 일관성
5. **의존성·결합** — 미사용 import, 불필요한 props 전달 깊이, 서버/클라이언트 경계 혼선

## 우선순위 정의

| 우선순위 | 의미 |
|----------|------|
| **High** | 유지보수·버그·하이드레이션·보안에 직결되거나 파일 단위 구조가 과도하게 비대함 |
| **Medium** | 중복·일관성·재사용성 문제로 비용이 누적됨 |
| **Low** | 스타일·미세 개선; 당장 동작에는 큰 영향 없음 |

## 출력 형식 (필수)

아래 **한 개의 마크다운 표**로만 정리한다. 열은 고정한다.

```markdown
| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|----------|----------|------|------|------|----------|
| 1 | High | `path/to/file.tsx` | 대략적 위치(함수·컴포넌트명) | 한 줄 요약 | 한 줄 권고 |
```

- **위치**: 줄 번호 대신 함수명·컴포넌트명·섹션 설명을 쓴다 (줄 번호는 쉽게 어긋남).
- **문제·권고사항**: 실행 가능하고 구체적으로; 나열은 10~20행 내에서 핵심만.

## 절차

1. 사용자가 범위를 주지 않으면 기본은 저장소의 **`frontend/`** 이하.
2. `grep`/검색으로 `any`, 큰 파일, 반복 패턴(검증·상수·캘린더 네비 등)을 찾는다.
3. 위 5축에 맞춰 행을 채운다. 중복 항목은 하나로 묶지 말고 **대표 파일**을 적되 괄호로 연관 파일을 적어도 된다.
4. 사용자 언어가 한국어면 표 본문(문제·권고)은 **한국어**로 쓴다.

## SSR·하이드레이션 (참고)

`Intl`, `Date.now()`, `Math.random()`, `typeof window` 분기는 서버/클라이언트 문자열 불일치를 일으킬 수 있다. 표에 넣을 때는 **표시용 날짜/시간 포맷** 후보를 명시한다.

## AGENTS.md

이 스킬 폴더의 진입점은 본 파일(`SKILL.md`)이다.
