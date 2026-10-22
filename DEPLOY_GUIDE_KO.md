# AI Stat Lab 블로그 업데이트·공동 작성 설정 안내

## 구성

이 업데이트는 기존 연구실 홈페이지를 유지하면서 Blog 메뉴와 게시글 상세 화면을 추가합니다. 연구실 구성원은 Pages CMS(https://app.pagescms.org)에서 작성합니다. 방문자는 GitHub Pages에 공개된 글을 읽습니다.

- 연구 분야, People/Alumni, Memory, Publications, News, 7장 홈 슬라이드쇼 유지
- 블로그 제목/본문/작성자/작성일/카테고리/언어/대표 이미지
- 검색 및 카테고리 필터, 한국어/영어 메뉴 전환
- 초기 안내글 2개(실제 논문/성과를 꾸며 쓴 예시는 아님)
- 작성 중 글은 **Published=OFF**, 완성 후 **Published=ON**
- 글 작성 및 편집 후 Github Actions가 사이트를 다시 빌드하는 방식

## 기존 GitHub 저장소 업데이트

1. 현재 저장소를 백업한 뒤 **GitHub Desktop으로 기존 저장소를 Clone**합니다.
2. `AI_Stat_Lab_Blog_Update_Only.zip`을 압축 해제하고, 그 안의 폴더·파일을 Clone한 저장소에 **같은 경로로** 덮어씁니다. (기존 파일 중 ZIP에 없는 파일은 삭제하지 마세요.)
3. macOS Finder에서 `.pages.yml`, `.github`가 안 보이면 `Cmd + Shift + .`를 눌러 숨김 파일을 표시합니다.
4. GitHub Desktop에서 `Commit to main`과 `Push origin`을 누릅니다.
5. GitHub 저장소의 **Settings → Pages → Build and deployment → Source → GitHub Actions**로 변경합니다. 이 단계가 없으면 새로 쓴 글이 자동 게시되지 않습니다.
6. **Actions → Build and deploy AI Stat Lab** 실행 결과가 성공인지 확인합니다. 홈페이지 URL은 기존 GitHub Pages 주소를 사용합니다.

## 관리자 CMS 설정

1. 연구실 홈페이지 소유자가 https://app.pagescms.org/ 접속 → GitHub 로그인
2. Pages CMS GitHub App을 **연구실 홈페이지 저장소만** 대상으로 승인/설치합니다. (사용자의 직접 승인이 필요)
3. 저장소의 `main`에서 **Lab Blog Posts** 컬렉션을 확인합니다.
4. Pages CMS의 **Collaborators** 메뉴에서 학생·연구원 이메일을 초대할 수 있습니다. 이메일 공동편집자를 쓰면 GitHub 저장소 전체 수정 권한을 꼭 줄 필요는 없습니다.
5. 구성원은 초대 링크로 편집기에 로그인한 뒤 New → 제목, 날짜, 작성자, URL identifier(영어 소문자·숫자·하이픈), 본문, 공개 여부를 입력해 저장합니다.
6. 이미지 업로드 시 CMS가 `assets/img/blog/`로 저장합니다. 방문자용 홈페이지는 로그인 기능 없이 읽기 전용으로 작동합니다.

## 관리자 책임과 한계

- `Published`는 홈페이지 노출 여부일 뿐, 연구실 책임자의 사전 승인 권한을 강제하지 않습니다. 내부 검토 절차를 별도로 운영해 주세요.
- **중요:** GitHub 저장소가 Public이면 `Published=OFF` 상태의 글도 GitHub 저장소 소스 파일로는 누구나 열람할 수 있습니다. 미공개 논문, 특허, 환자 정보 등 기밀 문서는 초안에도 넣지 마세요.
- 여러 학생이 편집할 수 있지만 Google Docs 같은 실시간 공동 커서 편집은 아닙니다. 저장 시 GitHub의 이력으로 기록됩니다.
- 게시물 본문의 언어는 자동 번역되지 않습니다. 각 글마다 한국어/영어 언어를 선택합니다.
- 환자정보, 제휴기업 비공개자료, 논문 심사 중 자료 등은 업로드하지 마세요.
- 현재 제공 파일은 GitHub에 자동 업로드되지 않았습니다. CMS 연결과 GitHub Pages 소스 전환까지 사용자가 완료해야 운영됩니다.

## 잘못된 위치에 파일을 올리지 않도록 주의

```text
AI Stat Lab GitHub Repository/
├── index.html
├── .pages.yml
├── .github/workflows/deploy-pages.yml
├── assets/
│   ├── app.js
│   ├── hero-slider.js
│   ├── blog.js
│   ├── blog.css
│   ├── style.css
│   ├── article-math.js
│   └── img/blog/
├── data/blog-index.js       (생성 파일)
├── content/blog/*.md        (게시글 원본, CMS 편집)
├── blog/<slug>/index.html   (초기 예시글 생성 파일)
├── scripts/build_blog.py
└── requirements-blog.txt
```

특히 `blog.js`와 `app.js`는 루트가 아니라 `assets/` 내부에, `.pages.yml`은 루트에 저장해야 합니다.
