# 디자인 토큰 캐논 — Figma 구축본 (2026-07 export)

> **원본:** `00_context/tokens/*.json` (Figma Variables export — 기계가 읽는 단일 진실). 이 문서는 그 사람용 요약이다. 두 개가 다르면 **JSON이 이긴다.**
> 컬렉션: `primitive-color`(숨김) → `semantic-color` → 컴포넌트가 직접 사용. 레이아웃은 `semantic-layout`. 다크 모드는 **아직 미구축**(라이트 단일 모드 — 확장 슬롯만 예약).

## 1. 코어 값
Primary `#FE7902` · Secondary `#26422A`(forest) · Tertiary `#42302D`(cocoa) · Ink `#0E0E0E` · BG `#F0F4F5` · Font Pretendard

## 2. Primitive (요약)
- **gray** 50~900 10단계 + `gray/white`(#FFFFFF): 50=#F0F4F5(BG) · 900=#0E0E0E(Ink)
- **orange** 50~900 10단계: 500=#FE7902 앵커
- **forest / cocoa / green / red / blue** 각 6단계(50·100·300·500·700·900)
- **alpha**: ink-8 / ink-12(그림자) · ink-60(스크림) · **glass-60**(#F0F4F5 60% — 라이트 글래스 오버레이)

## 3. Semantic Color (기획 문서에서 이 이름으로만 지칭)

| 그룹 | 토큰 = 값 | 기획 시 용도 |
|---|---|---|
| bg | `bg/default`=gray-50 · `bg/disabled`=gray-100 · `bg/surface`=white | 화면 배경 / 비활성 / 카드·시트·탭바 |
| text | `primary`(본문) `secondary`(메타) `tertiary`(플레이스홀더 전용—본문 금지) `disabled` `brand`(점수 숫자, orange-700) `on-button`(=white) | 아이콘 색 공용: 기본=text/primary·꺼짐=disabled·활성=main/primary |
| border | `default`=gray-200 · `focus`=orange-500 | 인풋/구분선 · 포커스·A vs B 선택 테두리(2px) |
| main | `primary`(+`-pressed` `-bg`) · `secondary`(〃) · `tertiary`(〃) | CTA·FAB·활성탭 / 지도마커·서브버튼 / 프리미엄·리더보드 |
| status | `success`(+bg) `danger`(+bg) `info`(+bg) | 토스트 / 삭제·오류 / 안내 — 상태 발생 시에만 노출 |
| grade | `good`=orange-500(+bg orange-50) · **`soso`=forest-500(+bg forest-50)** · **`bad`=gray-500(+bg gray-50)** | 좋음/그저/별로 3단계 칩 — **레이블 매핑: good=좋음, soso=그저, bad=별로** |
| overlay·shadow | `overlay/scrim`=ink-60 · `shadow/sm`=ink-8 · `shadow/lg`=ink-12 | 딤 / 카드 그림자 / 시트·FAB 그림자 |

### ⚠️ 기획 시 알아야 할 결정·리스크 3가지
1. **`text/on-button` = 흰색 단일.** 오렌지(#FE7902) 버튼 위 흰 라벨은 WCAG 대비 2.6:1로 AA 미달(잉크 라벨은 7.3:1). Figma 구축에서 흰색으로 확정됨 — 브랜드 감성 우선 결정으로 기록하되, **접근성 이슈 제기 시 잉크 라벨 대안이 검증돼 있음**을 기억. 딥컬러(forest·cocoa) 버튼 위 흰색은 11:1+로 문제 없음.
2. **grade 컬러 재정의:** '그저'=포레스트 그린, '별로'=그레이 (구버전의 그저=회색/별로=블루 폐기). 문서·와이어프레임에서 이 매핑 준수. 색상 단독 의존 금지 — 등급은 항상 텍스트 라벨 병행.
3. **다크 모드 미구축:** 화면 정의 시 다크 값을 임의로 지정하지 말 것. "다크 대응 시 semantic-color에 모드 열 추가" 한 줄로만 표기.

## 4. Semantic Layout

| 그룹 | 토큰 = 값 |
|---|---|
| spacing | `xxs`4 · `xs`8 · `sm`12 · `md`16(기본) · `lg`24 · `xl`32 · `xxl`48 · `page`20(화면 좌우) — 표기는 **xxs/xxl**(2xs 아님) |
| radius | `none`0 · `sm`4 · `md`8(기본) · `lg`12(시트 한정) — **12 초과·pill 금지** |
| icon | `sm`**20** · `md`24(기본, 탭바·앱바) · `lg`32 |
| border | `thin`1 · `thick`2(포커스·선택) |
| opacity | `disabled`0.4 · `scrim`0.6 |

터치 타겟 ≥44pt(토큰 아님, 규칙). Auto Layout·여백은 8배수 우선, 4pt 단계(xxs·sm)는 아이콘-텍스트 미세 관계 전용.

## 5. Typography (Figma Text Styles — Variables 아님)
`display` 24/800/130%(자간-1%, 화면당 1회) · `heading/lg` 20/700/140% · `heading/sm` 16/600/140% · `title` 14/600/150% · `body` 14/400/150% · `caption` 12/400/140% · `micro` 11/400/130%(화면당 2곳↓)
— **title↔body는 크기·행간 동일**: 같은 자리에서 리플로우 없이 하이라이트 교체 가능(닉네임·강조·버튼 라벨).

## 6. CSS 변수 변환 규칙 (핸드오프)
Figma `main/primary` → CSS `--main-primary` (슬래시→하이픈). 예: `--bg-surface` `--text-on-button` `--spacing-md` `--radius-md` `--icon-sm`.
