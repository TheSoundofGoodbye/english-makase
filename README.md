<div align="center">
  <h1>🍣 잉글리시 오마카세 (English Makase)</h1>
  <p><strong>나의 관심사로 배우는, 매일매일 새로운 진짜 원어민 영어 표현</strong></p>
</div>

<br/>

잉글리시 오마카세는 한국인 영어 학습자를 위해 만들어진 **초개인화 맞춤형 영어 학습 웹 애플리케이션**입니다. 딱딱한 교과서 영어가 아닌, 사용자가 선택한 취미와 관심사(스포츠, 비즈니스, 여행, 일상 등)에 꼭 맞는 생생한 영어 관용구(Idioms)를 매일 셰프의 오마카세처럼 서빙해 드립니다.

## ✨ 주요 기능 (Features)

- **🎯 관심사 기반 맞춤형 문장 제공**: 관심 카테고리(일상, 비즈니스, 여행, 스포츠/취미)를 선택하면 그에 맞는 원어민 관용구가 포함된 자연스러운 예문을 보여줍니다.
- **🖍 스마트 형광펜 (Diffing Algorithm)**: 과거에 학습한 단어 기록(Local Storage)을 분석하여, **사용자가 난생처음 보는 '새로운 관용구 전체(Phrase)'**만 쏙쏙 뽑아 형광펜으로 강조해 줍니다. 
- **⚡ 100% 오프라인 & 번개같은 속도**: 정적 데이터베이스(`idioms.json`)를 활용하여 모바일 환경이나 인터넷이 불안정한 곳에서도 대기 시간 없이 즉시 문장을 생성합니다.
- **🔒 완벽한 개인정보 보호**: 별도의 회원가입이나 백엔드 서버가 필요 없으며, API Key 유출 위험도 없습니다. 모든 학습 데이터는 사용자의 기기(브라우저)에만 안전하게 보관됩니다.
- **🎨 프리미엄 다크 모드 디자인**: 세련된 투명 유리 질감(Glassmorphism) UI와 부드러운 애니메이션 효과로 학습의 편안함과 즐거움을 더합니다.

## 🛠 기술 스택 (Tech Stack)

- **Frontend Core**: React (Vite), TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- **Database Architecture**: Local Static JSON (`src/data/idioms.json`)
- **State / Storage**: Browser LocalStorage API

## 🚀 로컬 실행 방법 (Getting Started)

현재 시스템(Node.js v18 이상 권장)에서 프로젝트를 실행하려면 아래의 명령어를 순서대로 입력하세요.

```bash
# 1. 저장소 클론
git clone https://github.com/TheSoundofGoodbye/english-makase.git

# 2. 프로젝트 폴더로 이동
cd english-makase

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

터미널에서 서버가 실행되면, 브라우저를 열고 `http://localhost:5173` 으로 접속하여 앱을 이용하실 수 있습니다.

## 📥 향후 파이프라인 (V5 Roadmap)
- [ ] **자동화 콘텐츠 파이프라인 (Github Actions)**: 개발자가 매일 JSON을 수동 업데이트하지 않아도 되도록, Github Actions 크론 잡 서버가 주기적으로 소형 AI나 뉴스 API를 호출하여 `idioms.json`을 자동으로 살찌우는 구조(Zero-cost Auto-updater)를 기획 중입니다!

---
*Developed with ❤️ as a fast, secure, and beautiful way to master native English expressions.*
