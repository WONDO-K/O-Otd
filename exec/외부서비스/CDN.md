## CDN(Bunny.net)

### Bunny.net
![Bunny](/exec/resources/Bunny1.png)

**사용 목적 : 대규모 이미지 파일과 URL 관리**

### 사용 방법
- **Bunny.net 계정 생성 및 로그인**
   - Bunny.net 홈페이지에서 계정을 생성한 후 로그인

- **Pull Zone 생성(SSL 활성화 필요)**
   - CDN을 사용하려면 Pull Zone을 생성 필수. Pull Zone은 콘텐츠를 서버에서 사용자에게 전달하는데 사용되는 경로
   - SSL을 활성화하여 HTTPS 연결을 사용하도록 설정
![Bunny](/exec/resources/Bunny2.png)

- **Storage Zone 설정**
   - Bunny.net의 Storage Zone을 설정하여 이미지 파일을 저장할 수 있는 공간 생성

- **FTP & API Access를 통해 이미지 관리**
   - FTP 또는 API를 통해 이미지 파일을 업로드하고 관리
![Bunny](/exec/resources/Bunny3.png)

- **이미지 및 파일 URL 관리**
   - 파일을 업로드한 후 Bunny.net에서 제공하는 URL을 사용하여 이미지 로드 가능
   - 예시 URL: `https://ssafy-o-otd.b-cdn.net/ootd_images/img_1.png'


**주의 사항 : 보안상 Username, Password는 환경변수로 설정하여 별도 관리**