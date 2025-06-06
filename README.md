# THE RAMZEE
🏆삼성 청년 SW아카데미(SSAFY) 12th 공통 프로젝트 우수상🏆

### 프로젝트 소개
<img src="https://github.com/user-attachments/assets/fd99f49f-84db-4add-802f-241bebfa0b04" width="50" height="50"> 

- 마피아류 웹 게임으로 다람쥐를 통해 플레이합니다.
- 이메일 인증을 통해 회원가입을 하고 게임을 플레이 할 수 있습니다.
- 친구 추가를 통해 친구와 같이 플레이하고 채팅을 할 수 있습니다.
- 미니게임을 플레이하고 나쁜 다람쥐를 피해 미션을 모두 완수합니다. 미션을 모두 완수하지 못하면 투표를 통해 나쁜 다람쥐를 찾아내세요.
- 개발 기간 : 2024.01.06 ~ 02.21
<br>

### 구성원
<table>
  <tbody>
    <tr width='100%'>
      <th align="center" width='14%'>팀장</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
    </tr>
    <tr>
      <td align="center"><img width="100" alt="image" src="https://github.com/user-attachments/assets/4b295f2c-bc5d-4502-9403-42208371d7cc"></td>
      <td align='center'><img width="100" alt="image" src="https://github.com/user-attachments/assets/e7c61dc8-be96-4b84-8959-4dd10b3c33e1"></td>
      <td align='center'><img width="100" height="130" alt="image" src="https://github.com/user-attachments/assets/961882e6-ddd8-414a-8930-5cce1f476e0c"></td>
      <td align='center'><img width="100" alt="image" src="https://github.com/user-attachments/assets/b2d853de-6247-4a5f-8488-91892a70e1cb"></td>
      <td align='center'><img width="100" alt="image" src="https://github.com/user-attachments/assets/9bb6cedf-60a9-4d27-8697-c07e4de2d9f4"></td>
      <td align='center'><img width="100" alt="image" src="https://github.com/user-attachments/assets/f85618d9-081f-415e-b6c3-d3085e039660"></td>
    </tr>
    <tr width='100%'>
      <th align="center" width='14%'>김선진</th>
      <th align="center" width='14%'>신경원</th>
      <th align="center" width='14%'>김경환</th>
      <th align="center" width='14%'>김승윤</th>
      <th align="center" width='14%'>박종경</th>
      <th align="center" width='14%'>이대현</th>
    </tr>
    <tr width='100%'>
      <th align="center" width='14%'>프론트앤드</th>
      <th align="center" width='14%'>프론트앤드, 디자인</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>인프라</th>
    </tr>
  </tbody>
</table>
<br>

# 👨🏻‍💻 담당 업무 (DevOps)

## :bust_in_silhouette: 이대현

> ### EC2 인프라 환경 세팅

- 전체 아키텍쳐 설계

- 서비스 SSL 보안 적용  
  - Let's Encrypt와 Certbot을 활용해 SSL 인증서를 발급 및 자동 갱신 설정
  - HTTPS 적용을 통한 공격 방지 및 데이터 보호

- 서버 구성 요소 설정  
  - Nginx, Docker, MySQL, ufw 등

- openvidu 서버 구성 및 클라이언트 연동 설정

- 환경변수 관리  
  - .env 파일 설계 및 관리 체계 구축

> ### FrontEnd / BackEnd EC2 배포

- Dockerfile 작성 및 Config 파일 설정

- docker-compose 파일을 통한 컨테이너 오케스트레이션 구성

> ### Nginx 웹서버 적용

- Reverse Proxy 설정  
  - Nginx를 이용하여 접근 제어 및 서비스 리다이렉션 구성

- 악성 봇 접근 차단  
  - 브루트포스 공격, 스크래핑 등 악성 트래픽 차단을 위한 보안 정책 적용

> ### Jenkins CI/CD Pipeline 구축

- GitLab Webhook 연동  
  - GitLab의 push 및 merge 이벤트 발생 시 Jenkins에 상태 전송 및 빌드 트리거 자동화

- Docker Hub 이미지 배포
  - 빌드 완료 후 Docker Hub에 이미지를 자동으로 푸시하는 CI/CD 파이프라인 구성

- EC2 서버 배포  
  - 최신 빌드 이미지를 EC2에서 자동으로 pull 받아 Docker 컨테이너 실행

- Mattermost 연동  
  - Jenkins 빌드 결과 및 상태를 Mattermost 채널에 알림 메시지 봇을 통해 전송

> ### GA4 연동

  - Google Analytics 4(GA4)와의 연동을 통해 사용자 행동 및 방문 통계를 분석
    - 게임 맵별 머무름 시간 및 이벤트 발생 패턴 분석
    - 지역별 분포, 평균 접속 시간, 재방문율 등 방문자 통계 심층 분석
<br>

### 프로젝트 아키텍쳐

![image](https://github.com/user-attachments/assets/382a737b-e125-4fce-aa23-06f12e95ceba)
<br>

- FRONTEND : 클라이언트의 요청은 nginx를 통해서 들어오게 됩니다.  프론트엔드는 react로 구현되어 있으며, 사용자 인증 및 권한 관리를 위해 accessToken을 사용합니다.
- BACKEND : 프론트앤드에서 요청한 요청을 바탕으로 MySQL, Redis에 대이터를 저장 추출해 프론트로 전달합니다. 보안을 위해 springsecurity를 이용하여 구현되었으며, jwt를 활용해 사용자의 인증 및 권한 부여를 담당합니다.
- Redis : 게임 진행 정보, 방의 sessionId, 채팅기록든 빠른 요청과 휘발성 데이터들을 저장합니다.

### CI/CD
- GitLab를 통해 코드베이스를 관리하며 변경 사항을 병합하기 위해 Pull Request를 생성하고 팀원들을 이를 검토하고 코드 리뷰를 진행합니다.
PR가 merge되면 Jenkins을 통한 CI/CD가 시작됩니다. 이 파이프라인은 빌드를 자동으로 시작하고 빌드된 코드가 자동으로 배포가 진행됩니다.
- 또한, AWS의 Secure Key Manager를 사용하여 DB 정보를 비롯한 암호화가 필요한 중요한 데이터들을 안전하게 관리하고 환경변수를 통해 접근합니다.
<br><br>

### 개발환경
 - 개발도구: Intellij IDEA - Ultimate, VSCode
 - 빌드도구: Gradle
 - 데이터베이스
    - MySQL: 8.0.25
    - Redis : 7.2.1
 - ERD
    - ERDCloud
 - 개발 환경 및 언어
    - 언어:
      - HTML
      - CSS
      - JavaScript
      - Java
    - 라이브러리 및 프레임워크:
      - react
      - Spring Framework
      - Spring Boot
        - Spring Data
        - Spring Data JPA
        - Spring Data Elasticsearch
        - Spring Data Redis
        - Spring Security
        - JPA
 - AWS
    - Instance
    - Secure Key Manager
 - 형상관리 및 이슈관리
    - GitLab
    - Jira
 - 기타
    - Mattermost
    - jenkins
  
### 개발언어

<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
<img src="https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> 

### 사용도구

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"> <img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"> <img src="https://img.shields.io/badge/spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/spring security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
<img src="https://img.shields.io/badge/spring Data Redis-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"/> 
<img src="https://img.shields.io/badge/websocket-010101?style=for-the-badge&logo=socket&logoColor=white">
<img src="https://img.shields.io/badge/spring Data Redis-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/OPENVIDU-333333?style=for-the-badge&logo=webrtc&logoColor=white">
<img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
 <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">
 <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white"/>
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
 <img src="https://img.shields.io/badge/soundcloud-FF5500?style=for-the-badge&logo=soundcloud&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/>

### etc
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white"/>
  <img src="https://img.shields.io/badge/amazonwebservices-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white">
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white"/>
  <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white"/>
  <img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  
<br>

### ERD
![image](https://github.com/user-attachments/assets/4ecf95f6-741a-4f9f-9dda-3af8736f1e51)
<br>
### 기능 명세서
![image](https://github.com/user-attachments/assets/3dbbcbad-26c2-4a62-bd10-e5cf8b253e75)
https://www.notion.so/1749cc6dad12808aa476fffcc0e57079?v=6b7c044b0f0440eca1af93f8e86a80b0&pvs=4<br>
명확한 설계와 기능 명세를 통해 명확한 기능 구현을 진행했습니다.

### 형상관리 및 이슈관리
![image](https://github.com/user-attachments/assets/4da577d9-fc7f-4b65-a28b-814e8435b8e3)
Jira를 통해 한주의 스프린트를 정하고 백로그를 진행해 현재 작업 상황을 실시간으로 확인할 수 있도록 했습니다.

### 스크럼
개발 기간 동안 총 20번이 넘는 스크럼이 진행되었고, 스크럼에서는 팀원들이 각자의 진행 상황을 공유하고 발생한 이슈들을 함께 논의하여 프로젝트를 원활하게 진행할 수 있었습니다.
<br><br>

### 사이트 소개

> ### 로그인<br>
<img src="https://github.com/user-attachments/assets/eaf3ed90-b862-45e7-99ee-27c04abf38df" width="400" height="250"/><br>
회원가입 후 로그인 진행합니다. 회원가입시 이메일 인증을 통해 회원가입을 진행합니다.<br>
아이디 / 비밀번호 찾기는 이메일로 아이디 / 비밀번호를 발급합니다.
<br><br>

> ### 로비, 친구 및 채팅, 프로필<br>
<img src="https://github.com/user-attachments/assets/438251a7-53f6-4a4a-b146-a5c794133cc0" width="400" height="250"/><br>
만들어진 방에 참여하거나 친구 목록을 확인 가능<br>
웹소캣을 활용해 실시간 친구 추가, 삭제, 친구 게임 따라가기 기능과 채팅 기능을 제공<br>
프로필에서 지금 캠화면을 체크하고 닉네임, 비밀번호 수정 및 탈퇴 기능 지원원
<br><br>
> ### 게임 진행<br>
<img src="https://github.com/user-attachments/assets/af1b42a0-da27-4190-8bd1-08edfc63a21d" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/2e884b7e-4aa2-4a41-afd3-021152cd9ff0" width="400" height="300"/>
<img src="https://github.com/user-attachments/assets/95417f95-59fa-40d6-bc5c-041f759bada4" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/36beadbc-21ef-4f40-8884-b198ed0902d1" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/63704158-c2be-488b-918a-0928b691f9c1" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/26ec5db4-3af7-45b6-a130-0513c140bbe0" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/2baec8ab-67aa-450a-bd1a-94f88953cc88" width="400" height="250"/>
<img src="https://github.com/user-attachments/assets/b7f68536-0a5e-418f-8ddc-4c6fe5212f67" width="400" height="250"/><br>
착한 다람쥐와, 나쁜다람쥐가 선정됩니다. 착한 다람쥐는 에너지를 채워 미션을 수행하고 창고에 도토리를 저장해 게임에서 승리합니다.<br> 나쁜 다람쥐는 에너지를 채워 착한 다람쥐를 모두 죽이고 승리합니다. 투표는 총 2회로 중간 투표, 최종 투표가 주어집니다.<br> 중간 투표에서는 게임을 망치는 인원이나 나쁜 다람쥐를 찾아 죽입니다.<br> 만약 나쁜 다람쥐가 죽으면 착한 다람쥐의 승리입니다.<br> 최종 투표에서는 나쁜 다람쥐가 죽으면 착한 다람쥐가 승리이지만 나쁜 다람쥐가 살아남았다면 나쁜 다람쥐의 최종 승리입니다.
<br><br>
