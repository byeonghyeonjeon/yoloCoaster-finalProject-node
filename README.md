# yoloCoaster - 여행 커뮤니티 사이트 - node
### 개요
- 대덕인재개발원에서 진행한 최종 프로젝트 (2018.06.15 ~ 2018.07.16)
- 국내관광API를 이용한 여행정보 조회 및 커뮤니티 사이트
- Spring Framework를 사용하여 구현

### 기능 소개
- 한국관광공사에서 제공하는 REST API를 이용하여 여행지 정보 및 여행지 위치(네이버 지도)를 제공
- 실시간 기능을 제공하기 위하여 Node.js 서버를 추가적으로 이용 (기본 톰캣)
- socket.io를 이용하여 실시간 채팅 기능 제공
- fullCalendar와 socket.io를 이용하여 실시간 일정 공유 기능 제공
- 네이버 및 페이스북을 이용한 OAuth인증 기능 제공
- 구글의 Cloud Vision API를 이용한 게시글 사진 필터링 기능 제공
- js-cookie를 이용한 최근 본 여행지 저장 기능 제공

### 참여자
이름|역할
---|---
김상준  |  PL
김규영  |  TA
김영릭  |  DA
전병현  |  UA
백선경  |  AA
고지희  |  AA

### 사용 언어
이름 | 버전
---|---  
java  |  1.7
jsp  |  2.2
html  |  5
css  |  3
javascript  |  5

### 개발 환경
구분 | 이름 | 버전
---|---|---
OS  | window  |  7 & 10
IDE  |  eclipse  |  3.7
editor  |  atom  |  1.27.2
DB 관리  |  SQL developer  |  4.0
데이터모델링  |  eXERD  |  2.5.1
UML모델링  |  StarUML  | 5.0
프로젝트 관리  |  maven  |  3.1
형상관리  | SVN  |  4.2.4
데이터베이스  |  oracle  |  11g
was  |  tomcat  |  7.0.85
채팅서버  |  node.js  |  8.11.1

### 외부API
이름 | 용도 | 참고
--- | --- | ---
네이버 OAuth | 네이버로 로그인 |  https://developers.naver.com/products/login/api
페이스북 OAuth | 페이스북으로 로그인 | https://developers.facebook.com/products/account-creation
네이버 검색  | 블로그 정보 조회  |  https://developers.naver.com/docs/search/blog
네이버 Map  | 여행지 위치 표시 지도  |  https://developers.naver.com/products/map
국내 관광 정보  | 여행지 정보 조회  |  http://api.visitkorea.or.kr/main.do
도로명주소  | 회원가입시 주소 입력  |  https://www.juso.go.kr/CommonPageLink.do?link=/addrlink/devAddrLinkRequestSample
google cloud vision  | 게시글 이미지 필터링  |  https://cloud.google.com/vision
full calendar  | 일정 관리  |  https://fullcalendar.io
socket.io  | 채팅 및 일정 공유  |  https://socket.io
java mail  | 이메일 본인인증  |  http://www.oracle.com/technetwork/java/javamail/javamail145-1904579.html
