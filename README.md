# Mercury World — Original Design Mirror

원본 mercury.or.kr (수은세상) 디자인을 Next.js로 미러링한 결과물입니다.

## 적용 대상 브랜치

**`original-design-mirror`** — main에 직접 적용 금지.

---

## Cursor 적용 절차

### 1. 사전 준비

```powershell
cd C:\Projects\mercury-world-rebuild

# 현재 브랜치 확인
git status
git branch -a

# main이 깨끗한지 확인 (uncommitted 변경 없어야 함)
```

### 2. original-design-mirror 브랜치 체크아웃

```powershell
# 브랜치가 없으면 새로 만들기
git checkout -b original-design-mirror

# 이미 있으면 체크아웃 + 최신화
git checkout original-design-mirror
git pull origin original-design-mirror
```

### 3. 기존 새 디자인 UI 제거

**그대로 덮어쓰기 전에 기존 app/, components/, public/ 안 새 디자인 잔재를 정리**:

```powershell
# 기존 새 디자인 파일들 (Tailwind/shadcn 잔재) 제거
Remove-Item -Recurse -Force app -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force components -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force public -ErrorAction SilentlyContinue

# 새 디자인 의존성도 정리 (있다면)
Remove-Item -Force tailwind.config.ts -ErrorAction SilentlyContinue
Remove-Item -Force tailwind.config.js -ErrorAction SilentlyContinue
Remove-Item -Force postcss.config.js -ErrorAction SilentlyContinue
Remove-Item -Force postcss.config.mjs -ErrorAction SilentlyContinue
```

### 4. 미러 번들 적용

받은 zip을 푼 후, 그 안의 `mercury-world-mirror/` 내용물을 프로젝트 루트로 복사:

```powershell
# 예시: 다운받은 zip을 풀고 그 안 mercury-world-mirror 내용을 복사
# (PowerShell — 디렉토리 구조 유지하며 덮어쓰기)
Copy-Item -Path "C:\Downloads\mercury-world-mirror\*" `
          -Destination "C:\Projects\mercury-world-rebuild\" `
          -Recurse -Force
```

### 5. 의존성 설치 및 빌드 검증

```powershell
# 기존 node_modules 정리 후 재설치 (Tailwind 잔재 의존성 제거)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

npm install
npm run build
```

빌드 성공 확인 후 다음 단계로.

### 6. 로컬 시각 검증

```powershell
npm run dev
# 브라우저에서 http://localhost:3000 — 원본과 비교
# http://localhost:3000/site/greeting
# http://localhost:3000/mercury/mercury
# http://localhost:3000/news/board
# http://localhost:3000/community/freeboard
# http://localhost:3000/content/one
```

원본 비교: https://web.archive.org/web/*/mercury.or.kr

### 7. 커밋 및 push (original-design-mirror에만)

```powershell
git add .
git commit -m "Mirror original Mercury World frontend from slim owner backup"

# 반드시 original-design-mirror 브랜치로만 push
git push origin original-design-mirror
```

### 8. Vercel Preview 검증

- https://vercel.com → mercury-world 프로젝트 → Deployments
- `original-design-mirror` 브랜치의 Preview URL 클릭
- Sleep 90초 후 캐시 우회로 검증:

```powershell
Start-Sleep -Seconds 90
Invoke-WebRequest -Uri "https://mercury-world-git-original-design-mirror-{org}.vercel.app/?nocache=$(Get-Date -UFormat %s)" `
                  -Headers @{"Cache-Control"="no-cache"}
```

(시크릿 창에서 직접 열어 시각 검증 권장)

### 9. main에 merge — 시각 검증 OK 받은 후에만

```powershell
# Teddy 시각 OK 후
git checkout main
git pull origin main
git merge original-design-mirror
git push origin main
```

---

## 주의 사항

- **DB 백업 / 카페24 전체 백업 절대 커밋 금지**: `.gitignore`에 `*.sql`, `*.tar.gz`, `mercury24/`, `admin/`, `conf/`, `lib/`, `cache/`, `zwebmy/` 등 차단 규칙이 이미 들어있음.
- **flash/mercury/1~5.gif 누락**: 메인 배너 슬라이드 이미지 5장이 슬림 번들에 빠져있음(카페24 비공개 폴더). 추후 전체 백업에서 추출하여 `public/flash/mercury/` 에 추가하면 자동 적용됨. 그 전까지는 main_flash.gif가 자리표시자로 표시됨.
- **게시판 / 통계 / 팝업**: 카페24 모듈(modules/board/, statistics) 의존이라 자리표시자로 표시. DB 이관 후 별도 구현 필요.

---

## 구조

```
.
├─ app/
│  ├─ globals.css         # 원본 css/style.css + header/footer/side_nav 스타일 통합
│  ├─ layout.tsx          # 루트 레이아웃 (jQuery 1.12.4 로드)
│  ├─ page.tsx            # 메인 (배너 슬라이더 + 게시판 3탭 + 메인비주얼)
│  ├─ not-found.tsx       # 404
│  ├─ sitemap/page.tsx    # 사이트맵
│  ├─ site/greeting/      # 인사말
│  ├─ mercury/            # 수은백서 5종
│  ├─ news/               # 수은소식 3종 (게시판 자리표시자)
│  ├─ community/          # 수은상담소 3종
│  └─ content/            # 식품속수은 2종
├─ components/
│  ├─ Header.tsx          # GNV + Quick menu (jQuery hover 동작)
│  ├─ Footer.tsx          # copyright_1/2 + 통계 자리
│  └─ SubPageLayout.tsx   # 서브 페이지 213+727 공통 레이아웃
├─ public/
│  ├─ img/                # 380 이미지 그대로 보존 (5MB)
│  ├─ js/                 # 원본 JS (f_fscript, etc, popup_new)
│  └─ upload/             # 원본 공개 첨부 (16개)
├─ next.config.js         # PHP URL → 깔끔한 라우트 redirects 17개
├─ package.json           # Next.js 14.2.18
├─ tsconfig.json
└─ .gitignore             # DB/백업/카페24 잔재 차단 규칙
```

## 디자인 토큰 (원본 보존)

- 본문 폭: **940px 고정** (PC 기준)
- 서브 페이지: 213px 좌측 + 727px 본문
- 폰트: 굴림 12px / line-height 18px
- 메뉴 폰트: sans-serif, MalgunGothic (letter-spacing -0.5px)
- 메인 그린 (GNV 보더): `#00be49`
- 활성 메뉴: `#0099cc`
- 호버: `#ff3300`
- 링크 호버: `#19B1B2`

## 향후 작업

1. 원본 비교 시각 검증 → main merge
2. 카페24 DB 백업 분석 → 게시판/관리자 기능 이관
3. flash/mercury/ 5개 배너 이미지 추출 후 public/flash/mercury/ 에 추가
4. 통계 / 팝업 / 통계 모듈 재구현
