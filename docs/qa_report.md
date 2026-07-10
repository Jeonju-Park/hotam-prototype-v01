# 호탐 프로토타입 검수 리포트 (QA)

> v0.1 · 2026-07-10 · 작성: 정주+Claude · 상태: review
> 대조 기준: `docs/_ia_table_fragment.md`(IA v0.1) · `docs/handoff_hotam_prototype_spec.md` · `docs/design_tokens.md`(충돌 시 우선)
> 검증 방법: 정적 전수 스캔(스크립트) + 브라우저 실측(dev 서버에서 클릭·입력·드래그 재현)

## 요약

| 항목 | 결과 |
|---|---|
| 1. 기능 커버리지 | **115/115 존재(100%)** · 스코프 제외 4(Later 3 · O9 1) · 누락 0 |
| 2. 어휘 | UI 라벨 위반 **0건** (유지 판정 3건 — §2 참조) |
| 3. 캐논 위반 5종 | 발견 1건(pill: 스위치 radius 13px) → **수정 완료**, 나머지 4종 0건 |
| 4. 토큰 | 발견 3건(하드코딩 1 · 토큰 외 radius 1 · r-lg 오용 1) → **전부 수정**, 문서화된 예외 2건 유지 |
| 5. 동작 | 골든 패스 통과 · 22화면 전부 도달 가능 · 콘솔 에러 **0** |
| 6. 인스펙터 | data-func-id 부착률 **115/115 (100%)** · 패널 필드 10종 완전 · IA 문구 하드코딩 0 |

---

## 1. 기능 커버리지 (IA 기능 행 119개 전수)

- 대상: M1·M2·M3 115개 (Later 3개 — HTM-S15-04 태그 검색, HTM-S17-03 해시태그, HTM-S2-08 가로 회전 / 결정대기 1개 — HTM-S3-03 교차 만족도(O9)는 스펙 서두 스코프 정의에 따라 제외)
- 판정: 코드 내 `data-func-id` 부착 위치 자동 스캔 + 브라우저 22화면 투어에서 DOM 실측(114개 직접 수집, S13 2개는 1.5초 자동 이동 특성상 무조건 렌더 코드로 확인)
- 조건부 노출 기능도 해당 상태를 만들어 실측함: HTM-S2-07(재방문 배너 — 리스트에 있는 식당 선택 시), HTM-S17-02(팔로우 버튼 — 미팔로우 작성자 게시물), HTM-S11-07·08(식당 랭킹 — M3 렌즈)

| 기능ID | 명칭 | 마일스톤 | 존재 | 위치(파일:라인) |
|---|---|---|---|---|
| **【진입】** | | | | |
| HTM-S13-01 | 시그니처 표시 | M1 | O | `screens/S13Splash.jsx:16` |
| HTM-S13-02 | 자동 로그인 | M1 | O | `screens/S13Splash.jsx:23` |
| HTM-A0-01 | 카카오 로그인 | M1 | O | `screens/A0Login.jsx:8` |
| HTM-A0-02 | Google 로그인 | M1 | O | `screens/A0Login.jsx:9` |
| HTM-A0-03 | Apple 로그인 | M1 | O | `screens/A0Login.jsx:10` |
| HTM-A0-04 | 이메일 로그인 | M1 | O | `screens/A0Login.jsx:11` |
| HTM-A0-05 | 이메일 회원가입 진입 | M1 | O | `screens/A0Login.jsx:42` |
| HTM-S14-01 | 이메일 입력·중복 확인 | M1 | O | `screens/S14Signup.jsx:8` |
| HTM-S14-02 | 이메일 인증 | M1 | O | `screens/S14Signup.jsx:8` |
| HTM-S14-03 | 비밀번호 설정 | M1 | O | `screens/S14Signup.jsx:8` |
| HTM-S14-04 | 약관 동의 | M1 | O | `screens/S14Signup.jsx:8` |
| HTM-S1-01 | 프로필 설정 | M1 | O | `screens/S1Onboarding.jsx:67` |
| HTM-S1-02 | 권한 요청 | M1 | O | `screens/S1Onboarding.jsx:89` |
| HTM-S1-03 | 지역 선택 | M2 | O | `screens/S1Onboarding.jsx:118` |
| HTM-S1-04 | 취향 선택(스와이프 평가) | M1 | O | `screens/S1Onboarding.jsx:137` |
| HTM-S1-05 | 가본 식당 추가 권고 | M2 | O | `screens/S1Onboarding.jsx:180` |
| HTM-S1-06 | 시작하기 | M1 | O | `screens/S1Onboarding.jsx:197` |
| **【홈】** | | | | |
| HTM-S7-01 | 앱바 — 로고타입 | M1 | O | `screens/S7Home.jsx:28` |
| HTM-S7-02 | 앱바 — 팔로우 추천 진입 | M2 | O | `screens/S7Home.jsx:30` |
| HTM-S7-03 | 앱바 — 알림 진입 | M1 | O | `screens/S7Home.jsx:38` |
| HTM-S7-04 | 앱바 — 검색 진입 | M1 | O | `screens/S7Home.jsx:35` |
| HTM-S7-05 | 팔로잉 피드 | M1 | O | `screens/S7Home.jsx:47` |
| HTM-S7-06 | 팔로잉/추천 탭 전환 | M2 | O | `screens/S7Home.jsx:54` |
| HTM-S7-07 | 추천 섹션 | M3 | O | `screens/S7Home.jsx:74` |
| HTM-S7-08 | 카드 — 작성자 정보 | M1 | O | `components/FeedCard.jsx:35` |
| HTM-S7-09 | 카드 — 표시 점수 | M1 | O | `components/FeedCard.jsx:47` |
| HTM-S7-10 | 카드 — 본문(선택) | M1 | O | `components/FeedCard.jsx:54` |
| HTM-S7-11 | 카드 — 식당명 | M1 | O | `components/FeedCard.jsx:60` |
| HTM-S7-12 | 카드 — 사진(선택) | M1 | O | `components/FeedCard.jsx:66` |
| HTM-S7-13 | 카드 — 좋아요 | M1 | O | `components/FeedCard.jsx:77` |
| HTM-S7-14 | 카드 — 좋아요 리스트 시트 | M2 | O | `components/FeedCard.jsx:83` |
| HTM-S7-15 | 카드 — 댓글 | M2 | O | `components/FeedCard.jsx:89` |
| HTM-S7-16 | 카드 — 공유 | M1 | O | `components/FeedCard.jsx:96` |
| HTM-S7-17 | 카드 — 저장 | M1 | O | `components/FeedCard.jsx:103` |
| HTM-S15-01 | 검색 실행 | M1 | O | `screens/S15Search.jsx:64` |
| HTM-S15-02 | 결과 탭 — 식당 | M1 | O | `screens/S15Search.jsx:103` |
| HTM-S15-03 | 결과 탭 — 프로필 | M1 | O | `screens/S15Search.jsx:106` |
| HTM-S15-04 | 결과 탭 — 태그 | Later | — | 스코프 제외(Later) |
| HTM-S15-05 | 최근 검색어 | M2 | O | `screens/S15Search.jsx:79` |
| HTM-S15-06 | 추천 검색어 | M3 | O | `screens/S15Search.jsx:88` |
| HTM-S15-07 | 정렬 | M2 | O | `screens/S15Search.jsx:115` |
| HTM-S15-08 | 필터 | M2 | O | `screens/S15Search.jsx:124` |
| HTM-S15-09 | 지도뷰 토글 | M3 | O | `screens/S15Search.jsx:134` |
| HTM-S16-01 | 추천 리스트 | M2 | O | `screens/S16FollowSuggest.jsx:17` |
| HTM-S16-02 | 팔로우 실행 | M2 | O | `screens/S16FollowSuggest.jsx:30` |
| HTM-S12-01 | 알림 리스트 | M1 | O | `screens/S12Noti.jsx:30` |
| HTM-S12-02 | 알림 종류 확장 | M2 | O | `screens/S12Noti.jsx:47` |
| HTM-S17-01 | 본문·댓글 전체 | M2 | O | `screens/S17PostDetail.jsx:44` |
| HTM-S17-02 | 팔로우 버튼 | M2 | O | `screens/S17PostDetail.jsx:51` |
| HTM-S17-03 | 해시태그 | Later | — | 스코프 제외(Later) |
| HTM-S17-04 | 반응한 사람들 보기 | M3 | O | `screens/S17PostDetail.jsx:59` |
| HTM-S17-05 | 식당 상세 요약·좋아하는 사람들 | M3 | O | `screens/S17PostDetail.jsx:89` |
| **【탐색】** | | | | |
| HTM-S9-01 | 검색 진입 | M1 | O | `screens/S9Explore.jsx:59` |
| HTM-S9-02 | 필터 | M2 | O | `screens/S9Explore.jsx:63` |
| HTM-S9-03 | 지도·핀 | M1 | O | `screens/S9Explore.jsx:75` |
| HTM-S9-04 | 내 위치 | M1 | O | `screens/S9Explore.jsx:82` |
| HTM-S9-05 | 리스트 바텀시트 | M1 | O | `screens/S9Explore.jsx:91` |
| HTM-S9-06 | 리스트 정렬 | M1 | O | `screens/S9Explore.jsx:111` |
| HTM-S9-07 | 리스트 항목 — 기본 정보 | M1 | O | `components/RestaurantRow.jsx:23` |
| HTM-S9-08 | 리스트 항목 — 확장 정보 | M2·M3 | O | `components/RestaurantRow.jsx:31` |
| HTM-S9-09 | 예상 점수(개인화) | M3 | O | `components/RestaurantRow.jsx:39` |
| HTM-S9-10 | 식당 추가 진입 | M1 | O | `screens/S9Explore.jsx:122` |
| HTM-S18-01 | 입력 폼·요청 활성화 | M1 | O | `screens/S18AddRestaurant.jsx:28` |
| HTM-S4-01 | 기본 정보 | M1 | O | `screens/S4Restaurant.jsx:94` |
| HTM-S4-02 | 친구 평점 | M1 | O | `screens/S4Restaurant.jsx:54` |
| HTM-S4-03 | 전체 평점 | M1 | O | `screens/S4Restaurant.jsx:124` |
| HTM-S4-04 | 큐레이션(예상) 점수 | M2 | O | `screens/S4Restaurant.jsx:132` |
| HTM-S4-05 | 리뷰 리스트 | M1 | O | `screens/S4Restaurant.jsx:177` |
| HTM-S4-06 | 찜(위시) | M1 | O | `screens/S4Restaurant.jsx:84` |
| HTM-S4-07 | 대표 메뉴·가격 | M3 | O | `screens/S4Restaurant.jsx:146` |
| HTM-S4-08 | 분위기·상세 정보 | M3 | O | `screens/S4Restaurant.jsx:162` |
| **【기록】** | | | | |
| HTM-S2-02 | 본문 입력(선택) | M1 | O | `screens/S2Record.jsx:10` |
| HTM-S2-03 | 사진 업로드(선택) | M1 | O | `screens/S2Record.jsx:10` |
| HTM-S2-04 | 가게 선택 — 검색 | M1 | O | `screens/S2Record.jsx:10` |
| HTM-S2-05 | 가게 선택 — 추천 | M2 | O | `screens/S2Record.jsx:103` |
| HTM-S2-06 | 가게 선택 — 없는 식당 추가 | M1 | O | `screens/S2Record.jsx:118` |
| HTM-S2-01 | 만족도 선택(수준 택1) | M1 | O | `screens/S2Record.jsx:10` |
| HTM-S2-07 | 재방문 안내 | M2 | O | `screens/S2Record.jsx:173` |
| HTM-S2-08 | 가로 회전 기록 모드 | Later | — | 스코프 제외(Later) |
| HTM-S3-01 | 비교쌍 제시·선택 | M1 | O | `screens/S3Compare.jsx:97` |
| HTM-S3-02 | 비교 스킵 | M1 | O | `screens/S3Compare.jsx:92` |
| HTM-S3-03 | 교차 만족도 추천 | 결정대기 | — | 스코프 제외(결정대기 · O9) |
| HTM-S3-04 | 비교 기준 선택 | M3 | O | `screens/S3Compare.jsx:122` |
| HTM-S19-01 | 최종 점수 표시 | M1 | O | `screens/S19RecordDone.jsx:40` |
| HTM-S19-02 | 내 리스트 보기 | M1 | O | `screens/S19RecordDone.jsx:56` |
| HTM-S19-03 | 점수 산정 방식 안내 | M2 | O | `screens/S19RecordDone.jsx:42` |
| HTM-S19-04 | 계속 기록 | M2 | O | `screens/S19RecordDone.jsx:59` |
| HTM-S19-05 | 점수 이의(재비교) | M2 | O | `screens/S19RecordDone.jsx:65` |
| HTM-S8-01 | 카드 생성·저장·공유 | M2 | O | `screens/S8ShareCard.jsx:170` |
| **【랭킹】** | | | | |
| HTM-S11-01 | 내 순위 카드 | M1 | O | `screens/S11Ranking.jsx:85` |
| HTM-S11-02 | 친구/전체 탭 | M1 | O | `screens/S11Ranking.jsx:93` |
| HTM-S11-03 | 동네 탭 | M2 | O | `screens/S11Ranking.jsx:101` |
| HTM-S11-04 | 기간 필터 | M2 | O | `screens/S11Ranking.jsx:111` |
| HTM-S11-05 | 사람 랭킹 리스트 | M1 | O | `screens/S11Ranking.jsx:122` |
| HTM-S11-06 | 리스트 내 팔로우 버튼 | M2 | O | `screens/S11Ranking.jsx:57` |
| HTM-S11-07 | 필터·리스트 | M3 | O | `screens/S11Ranking.jsx:138` |
| HTM-S11-08 | 범위 탭 | M3 | O | `screens/S11Ranking.jsx:70` |
| **【프로필】** | | | | |
| HTM-S10-01 | 설정 진입 | M1 | O | `screens/S10Profile.jsx:145` |
| HTM-S10-02 | 프로필 정보 | M1 | O | `screens/S10Profile.jsx:152` |
| HTM-S10-03 | 나의 식당 리더보드 진입 | M1 | O | `screens/S10Profile.jsx:186` |
| HTM-S10-04 | 활동 현황 — 가본 곳·위시 수 | M1 | O | `screens/S10Profile.jsx:173` |
| HTM-S10-05 | 취향 DNA 분석 | M3 | O | `screens/S10Profile.jsx:201` |
| HTM-S21-01 | 리스트·팔로우 관리 | M1 | O | `screens/S21Follows.jsx:37` |
| HTM-S5-01 | 등급 섹션·리스트 | M1 | O | `screens/S5MyList.jsx:102` |
| HTM-S5-02 | 순위 이의 — 드래그 재정렬 | M2 | O | `screens/S5MyList.jsx:127` |
| HTM-S5-03 | 검색·필터 | M3 | O | `screens/S5MyList.jsx:82` |
| HTM-S5-04 | 리스트 공유 | M2 | O | `screens/S5MyList.jsx:87` |
| HTM-S10-06 | 그리드·확대 보기 | M1 | O | `screens/S10Profile.jsx:54` |
| HTM-S10-07 | 보관 리스트 | M1 | O | `screens/S10Profile.jsx:93` |
| HTM-S10-08 | 게시물/가게 저장 분리 | M3 | O | `screens/S10Profile.jsx:84` |
| HTM-S6-01 | 핀 지도·공유 | M3 | O | `screens/S6MyMap.jsx:45` |
| **【설정】** | | | | |
| HTM-S20-01 | 공개 설정 | M1·M2 | O | `screens/S20Settings.jsx:30` |
| HTM-S20-02 | 프로필 정보 변경 | M1 | O | `screens/S20Settings.jsx:46` |
| HTM-S20-03 | 비밀번호 변경 | M1 | O | `screens/S20Settings.jsx:50` |
| HTM-S20-04 | 연결 계정 관리 | M2 | O | `screens/S20Settings.jsx:54` |
| HTM-S20-05 | 알림 설정 | M1·M2 | O | `screens/S20Settings.jsx:64` |
| HTM-S20-06 | 정책·약관·버전 | M1 | O | `screens/S20Settings.jsx:79` |
| HTM-S20-07 | 로그아웃 | M1 | O | `screens/S20Settings.jsx:92` |
| HTM-S20-08 | 회원 탈퇴 | M1 | O | `screens/S20Settings.jsx:95` |
| NAV_GLOBAL_01 | 바텀 내비게이션 | M1 | O | `components/BottomNav.jsx:18` (SCREENS "-" 레코드 매핑) |


---

## 2. 어휘 검수

**규칙(스펙 §3):** 선택 버튼 = `좋았어요/그저그래요/별로였어요` · 칩/헤더/통계/범례 = `좋음/그저/별로` · 내부어(밴드·Elo) UI 노출 금지.

**결과: UI 라벨 위반 0건.**

| 위치 | 어휘 | 판정 |
|---|---|---|
| S1 취향 버튼 · S2 만족도 버튼 (`GRADE_OPTIONS`) | 좋았어요/그저그래요/별로였어요 | ✅ 버튼 세트 |
| S3 캡션 "'좋았어요'끼리 비교 중" · 질문 | 좋았어요 | ✅ 버튼 세트(스펙 §6 명시) |
| GradeChip(전 화면 칩) · S5 그룹 헤더 · S6 범례 · S8/S10 등급 분포 | 좋음/그저/별로 | ✅ 축약 세트 · 색+텍스트 병행 |
| '밴드'·'Elo' 문자열 | 코드 주석에만 존재 | ✅ UI 미노출 |

**검토 후 유지 3건(위반 아님 판정):**
1. S19 산정 시트 "직접 매기는 **별점**이 없어요" — 별점이 없다는 제품 철학 설명 카피(§3 "비교를 통해 계산돼요" 수준 안내에 해당)
2. `dummy.js` 댓글 "저는 그저였는데" — 유저 발화 더미(UGC), UI 라벨 아님
3. `dummy.js` 본문 "혼밥 좋음" — 동일(UGC)

---

## 3. 캐논 위반 5종 점검

| # | 항목 | 결과 | 근거 |
|---|---|---|---|
| ① | 점수 직접 수정 UI | **0건** | 점수 입력(input number/range/slider) 전수 검색 0. 점수 산출 경로는 `S3Compare`의 비교 이벤트(중앙값±0.3, 밴드 클램프)뿐. S19 이의·S5 드래그도 비교 안내로만 연결(드래그는 순서만 변경, 점수 불변 실측) |
| ② | 교차 등급 비교 | **0건** | `S3Compare.jsx` 비교 풀 = `myListData[record.grade]` 단일 소스 — 다른 등급이 섞일 코드 경로 없음. 실측: good 기록 상대 3곳 전부 good, soso 기록 상대 전부 soso |
| ③ | 5탭 구조 변경 | **0건** | `App.jsx` TABS = 홈/탐색/기록(FAB)/랭킹/프로필 고정 5개 |
| ④ | pill(radius>12) | **1건 발견 → 수정** | 전수 스캔: S20 스위치 트랙 13px(§7 수정 내역 F-1). 수정 후 토큰 외 radius 0건. 원형(50%)은 캐논 예외로 유지: 아바타·기록 FAB(캐논 명시)·탐이·점·핀·스위치 노브 |
| ⑤ | 이모지 | **0건** | 유니코드 이모지 범위 전수 검색 0 (탐이는 점선 원형+라벨로만) |

---

## 4. 토큰 검수

**하드코딩 색상 전수 검색 결과 (tokens.css 외):**

| 위치 | 값 | 판정 |
|---|---|---|
| `global.css` .shell 배경 `#26422A` | 스펙 §1 명시값 | 🔧 수정 — `var(--main-secondary)`로 토큰화(동일값) (F-3) |
| `A0Login.jsx` 브랜드 점 `#FEE500`·`#4285F4` | 카카오·Google 로고 색 | ✅ 유지 — 스펙 A0 "브랜드 컬러 로고 점만" 명시 예외. 버튼 면·라벨은 전부 토큰 |
| `global.css` .ia-hot `rgba(255,255,255,.25)` | 호버 밝은 오버레이 | ✅ 유지 — 스펙 §8-1 리뷰 도구("살짝 밝은 오버레이"), 앱 UI 아님 |

그 외 색상 사용은 전부 `var(--*)` 토큰 참조(0건). radius도 수정 후 토큰 값만 사용하며, `--r-lg`(12)는 design_tokens.md §4 "시트 한정" 규정대로 바텀시트·탐색 시트(및 앱 외부 리뷰 도구 셸)에만 사용 (F-4).

**오렌지 총량(화면당 <10%):** 화면별 주황 요소 = 주 CTA 1곳(h48) + 점수 숫자(text-brand, 규정상 허용) + 활성 탭 아이콘/FAB 수준. 최다 화면은 S19(점수 히어로+CTA)와 S5(점수 열+방금 뱃지)이나 둘 다 점수 숫자 규정 내이며 채움 면적 10% 미만. 진행바는 오렌지 절약을 위해 forest 사용. **과다 화면 없음.** forest+cocoa 합산도 헤더 밴드(S8 공유 카드)가 최대이며 10% 미만.

---

## 5. 동작 검수

**골든 패스 (DoD: S13→A0→S1 5스텝→S7→S2 4스텝→S3 3쌍→S19→S5) — 브라우저 실측 통과:**

| 구간 | 확인 내용 |
|---|---|
| S13→A0 | 1.5초 자동 이동(replace — 뒤로가기로 스플래시 진입 불가) |
| A0→S1 | 소셜 버튼 더미 인증 통과, 온보딩 5스텝(닉네임 게이트·권한 토글·지역 M2 칩·취향 8장 전부 평가·완료) |
| S1→S7 | 시작하기 → 홈 피드, 탭바 등장 |
| S7→S2 | 중앙 FAB → 기록 4스텝(검색 선택 "망원우동"·사진 1장·본문·만족도 게이트) |
| S2→S3 | "'좋았어요'끼리 비교 중 · 1/3" — 같은 등급 3쌍(승·패·승) |
| S3→S19 | 점수 8.7 = 중앙값 8.4 +0.3 −0.3 +0.3 (밴드 내) · "오늘도 하나 낚아챘어요" |
| S19→S5 | 내 리스트 보기 → good 그룹에 망원우동 8.7 + "방금" 뱃지 표시 |

**22화면 도달 가능(고아 화면 0)** — 스플래시부터 탭·링크만으로 전부 도달(브라우저 투어 실측):

| 화면 | 진입 경로(대표) |
|---|---|
| S13 | 앱 시작 |
| A0 | S13 자동 이동 · S20 로그아웃/탈퇴 |
| S14 | A0 "이메일 회원가입" |
| S1 | A0 로그인 · S14 가입 완료 |
| S7 | 홈 탭 · S1 시작하기 |
| S15 | S7 검색 아이콘 · S9 검색 바 |
| S16 | S7 팔로우 추천 아이콘 · S7 빈 상태 CTA |
| S12 | S7 종 아이콘 |
| S17 | 피드 카드 본문/댓글 · S12 알림 항목 · S4 리뷰 행 · S10 가본 곳 타일 |
| S9 | 탐색 탭 |
| S18 | S9 "식당 추가" · S15 결과 없음 CTA · S2 없는 식당 추가 · S1 가본 식당 추가 |
| S4 | S9 핀/행 · S15 식당 결과 · S7 추천 카드 · S17 식당 요약 · S6 핀 |
| S2 | 중앙 FAB · S4 방문 기록하기(프리셋) · S19 계속 기록 |
| S3 | S2 완료 · S19 점수 이의(재비교 2쌍) |
| S19 | S3 완료 |
| S8 | S19 공유 카드 보기 · S5 공유 · S10 취향 DNA 공유 · S6 공유 |
| S11 | 랭킹 탭 |
| S10 | 프로필 탭 · 피드 작성자 탭(타 유저) |
| S21 | S10 팔로워/팔로잉 |
| S5 | S19 내 리스트 보기 · S10 나의 식당 리더보드 |
| S6 | S10 내 미식 지도(M3) |
| S20 | S10 설정 아이콘 |

**콘솔 에러: 0건** — 새 리로드 후 골든 패스 전 구간 실행 기준. (이전 세션 버퍼의 setState-in-render 경고는 S5 드래그 종료 핸들러 수정으로 해소 완료 — 수정 후 드래그 재실측 시 경고 0.)
**빌드:** `npm run build` 에러 0.

---

## 6. 인스펙터 검수 (스펙 §8)

- **부착률: 115/115 = 100%** (M1·M2·M3 전 기능, §1 표 참조. 누락 0. Later·O9 4건은 대상 제외) + `NAV_GLOBAL_01` 부착.
- **패널 표시 필드 10종 완전성** — 기능 호버 시 실측된 라벨 순서: `명칭 / 화면ID / 기능ID / 목적·기능 설명 / UX 카피 노트 / 진입→연결 / 마일스톤 / 중요도 / 이슈·색인 / 비고` (스펙 §8-1 순서 그대로). 비호버 시 화면 레코드(화면명·화면ID·목적·마일스톤·카피·비고) + 소속 기능 목록 + 역하이라이트 작동.
- **스페이스바 고정/해제** — 작동(입력창 포커스 중 무시 포함), 패널 핀 아이콘 동일 동작. 고정 중 화면 전환·호버에도 내용 유지 실측.
- **IA 문구 하드코딩: 0건** — 패널의 모든 표시 값은 `src/data/ia_inspector.js`(IA_META·SCREENS·FEATURES)에서만 읽음. 코드에 존재하는 유일한 IA 관련 매핑은 `NAV_GLOBAL_01 → SCREENS["-"]` 키 연결 1줄(`useInspector.js`)로, 문구가 아닌 키 참조임. 필드 라벨("명칭" 등)은 패널 UI 크롬으로 IA 데이터가 아님.

---

## 7. 수정 내역 (검수 중 발견 → 즉시 수정)

| # | 문제 | 위치 | 수정 |
|---|---|---|---|
| F-1 | **pill 위반**: 설정 토글 스위치 트랙 `border-radius: 13px`(>12 금지) | `global.css` .switch | 트랙 h26→24 · radius 13px→`var(--r-md)`(8), 노브 20→18(원형 예외 유지). 브라우저 실측 8px |
| F-2 | **토큰 외 radius**: 세그먼트 버튼 `6px` (토큰: 4/8/12만) | `global.css` .lens-seg button · .seg-btn | `var(--r-sm)`(4)로 교체 |
| F-3 | **하드코딩 색상**: 셸 배경 `#26422A` 리터럴 | `global.css` body | `var(--main-secondary)`로 토큰화(동일값, 스펙 §1 주석 유지) |
| F-4 | **r-lg 용도 위반**: design_tokens §4 "lg(12)=시트 한정"인데 카드 8종에 사용 | `global.css` .feed-card .share-card .taste-card .vs-card .mylist-group .myrank-card .dna-card .error-card | 전부 `var(--r-md)`(8)로 정정. r-lg 잔존 = 바텀시트 2곳 + 리뷰 도구 셸(.frame/.inspector — 앱 UI 외) |

수정 후 재검증: `npm run build` 에러 0 · 토큰 외 radius 0건 · 콘솔 에러 0 · 골든 패스 재통과.

**의도적 예외(수정하지 않음, 근거 문서화):** A0 프로바이더 브랜드 점 2색(스펙 A0 명시) · .ia-hot 오버레이(스펙 §8 리뷰 도구) · 원형 50% 요소(아바타·FAB 캐논 예외).

⚠️ 미충족: 없음
