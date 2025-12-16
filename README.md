# StudentLMS (열정스토리 LMS)

이 프로젝트는 학원/과외 관리 시스템(LMS)입니다. Frontend는 React(Vite), Backend는 Express + MongoDB를 사용합니다.

## 필수 요구사항 (Prerequisites)
- **Node.js**: v18 이상
- **MongoDB**: 로컬 설치 및 실행 필요
- **Homebrew** (Check macOS)

## 설치 및 실행 방법 (How to Run)

### 1. MongoDB 설정
MongoDB가 설치되어 있지 않다면 설치하고 서비스를 시작해야 합니다.

**macOS (Homebrew):**
```bash
# 설치
brew tap mongodb/brew
brew install mongodb-community@7.0

# 서비스 시작
brew services start mongodb/brew/mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
# GPG 키 가져오기
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# 리스트 파일 생성 (Ubuntu 22.04 jammy 기준)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 설치
sudo apt-get update
sudo apt-get install -y mongodb-org

# 서비스 시작
sudo systemctl start mongod
sudo systemctl enable mongod
```
*다른 Linux 배포판은 [공식 문서](https://www.mongodb.com/docs/manual/administration/install-on-linux/)를 참고하세요.*


### 2. 프로젝트 의존성 설치
프로젝트 루트와 서버 디렉토리 모두 의존성을 설치해야 합니다.

```bash
# Frontend (Root)
npm install

# Backend (Server)
cd server
npm install
cd ..
```

### 3. 데이터베이스 초기화 (Seeding)
초기 데이터(선생님, 학생 등)를 DB에 넣으려면 시딩 스크립트를 실행합니다.
**주의**: 기존 데이터가 모두 초기화됩니다.

```bash
cd server
npx ts-node seed.ts
cd ..
```

### 4. 애플리케이션 실행
백엔드와 프론트엔드를 각각 실행해야 합니다. 터미널 탭을 2개 열어주세요.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Server runs on: http://localhost:5001*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*App runs on: http://localhost:5173*

## 로그인 정보 (Login Credentials)

### 관리자 (Admin)
- **ID**: `admin`
- **PW**: `admin1234`

### 선생님 (Teacher)
- **ID**: `01055829031` (예시: 배한일 선생님)
- **PW**: `1234` (기본값)
- *Note*: 선생님은 최초 로그인 시 비밀번호 변경이 요구됩니다.
