# `public/original-assets/`

원본 mercury.or.kr (수은세상) 사이트의 정적 자산을 운영자가 직접 다운로드하여
이 디렉터리 아래에 배치한다.

> 본 작업은 **사이트 운영자/권한자가 본인이 권리를 보유한 자산**을 가져오는
> 경우에만 진행한다. 외부 스크래핑·재배포 권한이 없는 자산은 포함하지 않는다.

---

## 권장 배치 구조

운영자가 본인 PC 에서 (예: `wget --mirror`, HTTrack, 또는 단순히 브라우저
"다른 이름으로 페이지 저장(전체)"로) 받은 결과를 그대로 다음 구조로 풀어 둔다.
폴더/파일명은 가능하면 **원본의 URL 경로를 그대로 유지**한다.

```
public/original-assets/
├── pages/
│   ├── index.html                   # https://www.mercury.or.kr/ 의 저장본
│   ├── site/greeting.html           # /site/greeting.php
│   ├── mercury/mercury.html         # /mercury/mercury.php
│   ├── mercury/cycle.html
│   ├── mercury/fish.html
│   ├── mercury/emergency.html
│   ├── mercury/standard.html
│   ├── content/content.html
│   ├── content/oneday.html
│   └── bbs/
│       ├── notice.html              # /bbs/board.php?bo_table=notice
│       ├── news.html
│       ├── mercury.html
│       ├── qna.html
│       ├── request.html
│       └── kit.html
├── css/                             # 원본 <link rel="stylesheet"> 파일들
│   ├── style.css
│   ├── default.css
│   └── ...
├── js/                              # 원본 <script src> 파일들 (있는 것만)
│   └── ...
├── images/                          # 본문 이미지 + background-image 모두
│   ├── logo.png
│   ├── header_bg.jpg
│   ├── main/
│   └── ...
├── fonts/                           # 사용 시 함께 (라이선스 확인 후)
└── manifest.json                    # (선택) 어떤 자산이 어디서 왔는지 메모
```

> 압축 zip 으로 주셔도 됩니다. 이 README 와 같은 디렉터리에 zip 을 풀면 됩니다.

---

## 권장 다운로드 방법 (운영자가 본인 PC 에서 실행)

### A. 가장 단순: 브라우저로 페이지 단위 저장

1. Chrome/Edge 에서 각 페이지를 연다.
2. `Ctrl + S` → 저장 형식 **"웹 페이지, 전체"** 선택.
3. 결과 폴더 (`*_files`) 와 `.html` 을 위 표 구조대로 옮긴다.
4. 위 목록의 15 개 페이지를 모두 동일하게 저장.

### B. wget mirror (Linux/macOS, 또는 WSL)

```bash
wget \
  --mirror \
  --convert-links \
  --adjust-extension \
  --page-requisites \
  --no-parent \
  --user-agent="Mozilla/5.0" \
  --wait=1 \
  --random-wait \
  -P ./mirror_dump \
  https://www.mercury.or.kr/
```

받은 후 `./mirror_dump/www.mercury.or.kr/` 의 내용을 본 디렉터리 아래로 옮긴다.

### C. HTTrack (Windows GUI)

1. <https://www.httrack.com> 에서 WinHTTrack 설치.
2. Project Name: `mercury-or-kr`
3. URL: `https://www.mercury.or.kr/`
4. Action: "Download web site(s)" 선택.
5. 옵션 → Limits 에서 Maximum mirroring depth 를 적당히(예: 3) 설정.
6. 결과 폴더의 `www.mercury.or.kr/` 디렉터리를 본 디렉터리로 가져오기.

---

## 통합 후 처리 방침 (작업자 노트)

자산이 도착하면 본 브랜치 `original-design-mirror` 에서 다음 순서로 통합한다.

1. `public/original-assets/pages/*.html` 의 마크업을 분석해
   - 헤더(로고/탑네비)
   - 좌측 메뉴
   - 본문 컨텐츠 영역
   - 푸터
   네 영역의 HTML 구조와 class 이름을 확인.
2. 원본 CSS 를 `app/globals.css` 와 별도로 `public/original-assets/css/` 에서
   그대로 import. 신규 디자인용 변수/클래스(`--color-primary`, `feature-card`
   등) 는 제거 또는 비활성.
3. Next.js 컴포넌트로 옮길 때 **원본 class 이름을 유지**:
   - `SiteHeader.tsx` → 원본 헤더 마크업과 같은 class/구조로 재작성
   - `SiteFooter.tsx` → 동일
   - `InfoPageLayout.tsx` → 좌측 메뉴 + 컨텐츠 박스 구조 동일
   - `BoardList.tsx` → 원본 게시판 표 마크업/class 와 동일
4. 이미지 경로는 `/original-assets/images/...` 로 그대로 사용.
   원본 페이지의 `<img src="/img/logo.png">` 같은 절대 경로는
   `<img src="/original-assets/images/logo.png">` 형태로 치환.
5. PHP 페이지의 동적 부분(공지 위젯, 게시글 미리보기 등)은 본 프로젝트의
   Supabase 데이터로 채운다. (상위 디자인은 동일, 내용만 새 DB.)
6. 마지막으로 `app/page.tsx`, 각 정보 페이지의 본문 텍스트는 운영자가 보유한
   원본 카피로 교체.

---

## 자산 검증 체크리스트

운영자가 자산을 올린 직후 확인할 항목:

- [ ] 헤더 로고 이미지 1 개 이상
- [ ] 메인 페이지 HTML 1 개
- [ ] 정보 페이지 HTML 8 개 (greeting, mercury×5, content×2)
- [ ] 게시판 페이지 HTML 6 개 (notice/news/mercury/qna/request/kit)
- [ ] CSS 파일이 모두 `pages/*.html` 의 `<link rel="stylesheet" href="...">` 와
      매칭되는지 (깨진 링크 없는지)
- [ ] background-image 로 사용된 이미지도 포함 (CSS 의 `url(...)` 검색)
- [ ] 폰트 파일 사용 시 라이선스 명시
