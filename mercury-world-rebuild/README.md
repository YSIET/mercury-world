# 수은세상 홈페이지 재구축 프로젝트

공개된 기존 수은세상 사이트의 메뉴 구조와 본문 내용을 바탕으로 재구성한 Vite + React 정적 사이트입니다.

## Cursor에서 실행

```bash
npm install
npm run dev
```

브라우저에서 표시되는 로컬 주소를 열어 확인합니다.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Rebuild Mercury World website"
git branch -M main
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

## Vercel 연결

1. Vercel에서 `Add New Project` 선택
2. GitHub 저장소 선택
3. Framework Preset은 `Vite`
4. Build Command는 `npm run build`
5. Output Directory는 `dist`
6. 배포 후 Project Settings > Domains에서 `www.mercury.or.kr`와 `mercury.or.kr` 추가

## 도메인 DNS 예시

- `www` CNAME: `cname.vercel-dns.com`
- apex/root `mercury.or.kr` A: `76.76.21.21`

도메인 등록기관 DNS 설정에서 기존 호스팅 레코드를 제거하거나 우선순위를 정리한 뒤 위 레코드를 추가합니다.
