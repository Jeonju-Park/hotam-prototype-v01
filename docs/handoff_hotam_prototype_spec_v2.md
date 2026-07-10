# 호탐 프로토타입 스펙 v2.0.0 — 라이브 IA 테이블 (Supabase 동기화)

> v2.0.0 · 2026-07-10 · 작성: 정주+Claude · 상태: draft
> **전제:** v1(`handoff_hotam_prototype_spec.md`) 완성본에서 출발. 이 문서는 v1과의 **차이만** 명세한다 — 화면 22개·토큰·더미데이터·어휘·렌즈·데모 스위치 등 v1 규칙은 그대로 유효.
> **v2의 4가지 완성 조건:** ①v1 태그 박제 후 버전업 ②원격 2인 이상 동시 열람·실시간 소통 ③IA 테이블 수정 → 프로토타입 즉시 반영(특히 마일스톤→투명도) ④프로토타입 호버 → 테이블 행 하이라이트.

---

## 1. 아키텍처 변화

v1: `src/data/ia_inspector.js`(정적 파일) → 인스펙터 패널(읽기 전용).
**v2: Supabase(Postgres + Realtime)가 IA의 단일 진실.** 우측 패널은 인스펙터를 대체하는 **편집형 IA 테이블**이 되고, 모든 브라우저가 Realtime 구독으로 동기화된다. `ia_inspector.js`는 삭제하지 않고 **시드(최초 데이터 주입) + 오프라인 폴백**으로 남긴다(Supabase 연결 실패 시 읽기 전용 모드로 자동 전환 + 상단에 "오프라인 — 읽기 전용" 배너).

- 클라이언트: `@supabase/supabase-js`만 추가. 다른 라이브러리 금지(테이블도 자체 구현 — 엑셀급 그리드 라이브러리 불필요).
- 키 관리: `src/lib/supabase.js`에 URL·anon key. 공개 저장소에 anon key가 노출되는 것은 프로토타입 한정으로 허용하되, **RLS로 아래 4개 테이블 외 접근 차단** + 선택형 4자리 PIN 게이트(환경 상수, 켜고 끌 수 있게).
- localStorage: v1에서 금지했으나 **v2 도구 설정에 한해 허용** — 작성자 이름, PIN 통과 여부, 테이블 필터 상태만. 제품 데이터(더미) 저장은 여전히 금지.

## 2. Supabase 스키마 (Claude Code가 SQL로 생성)

```
ia_screens   — id(text PK, 예 "S7"), area, name, label, type, purpose,
               milestone, copy, flags, note, memo(text, 신규), archived(bool), updated_at
ia_features  — id(text PK, 예 "HTM-S7-13"), screen(FK ia_screens.id), area, screen_name,
               name, label, type, purpose, milestone, importance, nav, copy, flags, note,
               memo(text, 신규), sort_order(int), archived(bool), updated_at
ia_memos     — id(uuid PK), target_id(text — 화면ID 또는 기능ID), author(text),
               body(text), created_at            ← 스레드형 소통 메모
ia_change_log— id(uuid PK), target_id, field, old_value, new_value, author, created_at
```

- **memo 컬럼(신규):** 요청된 "IA 메모 컬럼" — 행에 상시 붙는 한 줄 메모. 스레드 대화는 `ia_memos`(누가·언제 포함)로 분리해 히스토리 소통을 담당.
- **모든 쓰기는 change_log에 자동 기록**(앱에서 update 시 함께 insert): 마일스톤 변경·메모·수정 전부 "누가 언제 무엇을 어떻게" 추적 가능.
- **삭제 없음 원칙:** 행 삭제 대신 `archived=true`(테이블에서 회색 접힘). IA 문서 규칙(삭제 지양)과 동일.
- 시딩: `ia_inspector.js`의 SCREENS 27·FEATURES 119를 1회 업로드하는 스크립트(`scripts/seed.js`). 재실행 시 덮어쓰기 경고.
- RLS: 4개 테이블 anon SELECT/INSERT/UPDATE 허용, DELETE 차단. 그 외 테이블 접근 불가.

## 3. 우측 패널 = 라이브 IA 테이블 (인스펙터 대체)

패널 폭 360→**480px**(테이블이라 넓게, 뷰포트 <1280px면 자동 축소·접기 버튼). 상단 헤더: "IA Live · v2" + 연결 상태 점(초록=실시간/회색=오프라인) + 작성자 이름 칩(첫 진입 시 "정주/대표/게스트" 선택). 하단 탭 3개: **테이블 | 메모 | 히스토리**.

**테이블 탭**

- 기본 뷰 = **현재 화면의 기능 행만** 필터(토글로 "전체 화면 보기"). 컬럼: 기능ID · 명칭 · **마일스톤(칩 드롭다운: M1/M2/M3/Later/결정대기)** · 중요도 · 메모(한 줄). 행 클릭 → 아코디언 확장: 목적·기능 설명 / UX 카피 / 진입→연결 / 이슈·색인 / 비고 / 메모 스레드 미리보기(최근 2개+입력창).
- **CRUD:** 셀 더블클릭=인라인 편집(Enter 저장, Esc 취소), "＋기능 추가"(기능ID는 `HTM-S#-##` 형식 검증+중복 차단), 행 메뉴에서 보관(archived). 저장 즉시 Supabase update + change_log insert.
- **③ 즉시 반영:** 마일스톤 드롭다운 변경 → 저장과 동시에 해당 `data-func-id` 요소의 M 뱃지·렌즈 투명도(범위 밖 opacity 0.25+클릭 잠금)가 **본인 화면과 원격의 모든 브라우저에서** 재계산. 다른 필드(카피·명칭 등)는 테이블·상세 표시에 반영(프로토타입 UI 문구는 더미라 자동 변경 대상 아님 — 행에 "UI 반영 필요" 수동 체크 플래그 제공).
- **④ 하이라이트(양방향):** 프로토타입 요소 호버 → 테이블 해당 행 하이라이트(`grade-good-bg` 톤)+자동 스크롤. 반대로 행 호버 → 프레임 안 요소 아웃라인(v1 역하이라이트 승계). v1의 스페이스바 고정은 **행 클릭=선택 고정**으로 대체(선택 행은 호버에도 유지, 재클릭 해제).
- 원격 변경 수신 시: 해당 행 1초 플래시 + 토스트 "대표: HTM-S7-15 마일스톤 M2→M3".

**메모 탭** — `ia_memos` 전체를 최신순 스레드로(작성자·시간·대상 ID 칩, ID 칩 클릭 → 해당 행+요소 하이라이트). 새 메모 알림 뱃지. **소통 채널의 본체.**

**히스토리 탭** — `ia_change_log` 최신순: "7/12 14:02 대표 · HTM-S5-02 · milestone: M2→M1". 대상 ID 클릭 → 행 이동. 필드·작성자 필터.

## 4. IA 문서 체계와의 관계 (중요 — 기획 폴더 반영 사항)

v2 가동 시점부터 **IA의 단일 진실은 Supabase로 이동**하고, `ia_hotam_전체.xlsx`는 보고·보관용 스냅샷이 된다. 이에 따라:

1. 테이블 헤더에 **"CSV 내보내기"** 버튼(현재 Supabase 상태 전체 다운로드) — 대표 보고·백업용.
2. 정식 xlsx 갱신(v0.2 등)은 Cowork(정주+Claude)에서 CSV를 받아 재생성 — 서식·집계 시트 유지.
3. 이 원본 이동은 `ia_hotam_변경사항.md`에 **C-15**로 기록할 것(문구: "IA 단일 진실을 xlsx→Supabase로 이전, xlsx는 스냅샷화. 시점=v2 배포일").
4. xlsx에 **메모 컬럼 추가**: 다음 xlsx 재생성 시 '메모' 열 추가(Supabase memo 컬럼 대응).

## 5. v2 완성 기준 (DoD)

- [ ] v1이 git 태그 `v1.0.0`으로 박제되고 v2는 별도 브랜치→main 병합으로 진행
- [ ] 브라우저 2개(시크릿 창 포함)를 나란히 열고: A에서 마일스톤 변경 → B의 테이블 값과 프로토타입 투명도가 3초 내 갱신
- [ ] 프로토타입 호버 → 테이블 행 하이라이트+스크롤 / 행 호버 → 요소 역하이라이트 / 행 클릭 고정
- [ ] 메모 작성 → 상대 브라우저에 뱃지+토스트, 히스토리에 전 변경 기록 누적
- [ ] 기능 추가·편집·보관이 형식 검증과 함께 작동, DELETE는 DB 차원 차단
- [ ] Supabase 미연결 시 정적 데이터로 읽기 전용 폴백 + 배너
- [ ] CSV 내보내기 정상, anon key 외 비밀 없음, RLS로 4개 테이블 외 차단
- [ ] v1 DoD 항목(22화면·골든 패스·어휘·토큰·빌드 무오류) 회귀 통과
