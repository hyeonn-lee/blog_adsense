# 시니어 헬스 블로그 (seniorhealth.homes)

Next.js 기반 정적 블로그. 글은 `posts/` 폴더의 마크다운 파일로 관리되며,
`/admin` 페이지에서 글을 작성하면 파일 생성 + GitHub 커밋/푸시까지 자동으로 처리됩니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## 글 작성 방법

1. `npm run dev`로 로컬 서버 실행
2. http://localhost:3000/admin 접속 (이 페이지는 프로덕션 빌드/배포본에는 노출되지 않습니다)
3. 제목, 카테고리, 태그, 본문(마크다운)을 입력하고 저장
4. 저장하면 `posts/` 폴더에 `.md` 파일이 생성되고, 자동으로 git commit + push까지 실행됩니다
   (원격 저장소가 연결되어 있어야 push가 됩니다. 자동 push를 끄려면 `.env.local`에
   `ADMIN_AUTO_GIT_SYNC=false` 를 추가하세요)
5. **초안(draft) 체크박스**를 켜두면 실제 배포 사이트에는 노출되지 않고, 준비가 끝나면
   체크를 해제하고 다시 저장하면 됩니다

글감 파일 형식이 궁금하면 `posts/example-post.md`를 참고하세요.

## 환경변수

`.env.local.example`을 복사해 `.env.local`로 저장한 뒤 값을 채워주세요.

- `NEXT_PUBLIC_SITE_URL` — 배포 도메인 (예: https://seniorhealth.homes)
- `NEXT_PUBLIC_AUTHOR_NAME` / `NEXT_PUBLIC_CONTACT_EMAIL` — 소개/문의 페이지에 노출
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — 애드센스 승인 후 발급되는 `ca-pub-...` 값
- `NEXT_PUBLIC_GA_ID` — Google Analytics(GA4) 측정 ID
- `ADMIN_AUTO_GIT_SYNC` — `/admin` 저장 시 자동 git commit/push 여부 (기본 true)

## 배포 (Vercel)

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 가입
2. "Add New... > Project"에서 이 저장소(`blog_adsense`) Import
3. Environment Variables에 위 환경변수 값 입력 후 Deploy
4. 배포 완료 후 Project Settings > Domains에서 `seniorhealth.homes` 추가
   → Vercel이 알려주는 A 레코드 / CNAME 값을 Porkbun DNS 설정에 등록

이후 `main` 브랜치에 push될 때마다 자동으로 재배포됩니다.

## 폴더 구조

```
posts/                 실제 글 (마크다운, 파일 하나 = 글 하나)
src/app/                페이지 라우트
src/app/admin/          글 작성 에디터 (개발 환경 전용)
src/app/api/admin/      에디터 저장 API (개발 환경 전용)
src/components/         공통 UI 컴포넌트
src/lib/                글 읽기/마크다운 변환/git 자동화 로직
src/config/site.ts      사이트 이름, 설명, 카테고리 등 기본 설정
docs/                   기획/요구사항 문서
```
