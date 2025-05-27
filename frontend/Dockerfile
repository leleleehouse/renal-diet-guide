# 1. Node.js 공식 이미지 사용
FROM node:20

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치
COPY package*.json ./
RUN npm install
RUN npm rebuild lightningcss --force
# 4. 소스 복사
COPY . .

# 5. **프로덕션 빌드 수행**
RUN npm run build

# 6. 포트 노출 (Next.js는 기본적으로 3000번 포트 사용)
EXPOSE 3000

# 7. 앱 실행
CMD ["npm", "start"]
