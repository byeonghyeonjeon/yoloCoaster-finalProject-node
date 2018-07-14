# yoloCoaster - 여행 커뮤니티 사이트 - node
### 개요
- 대덕인재개발원에서 진행한 최종 프로젝트 (2018.06.15 ~ 2018.07.16)
- 채팅 및 일정공유 기능

### 기능 소개
- 실시간 기능을 제공하기 위하여 Node.js 서버를 추가적으로 이용 (기본 톰캣)
- socket.io를 이용하여 실시간 채팅 기능 제공
- fullCalendar와 socket.io를 이용하여 실시간 일정 공유 기능 제공

### 참여자
이름|역할
---|---
김상준  |  PL

### 개발 환경
구분 | 이름 | 버전
---|---|---
OS  | window  |  7 & 10
editor  |  atom  |  1.27.2
채팅서버  |  node.js  |  8.11.1

### 외부API
이름 | 용도 | 참고
--- | --- | ---
socket.io  | 채팅 및 일정 공유  |  https://socket.io

### 구현 사진
- 채팅
![image](https://user-images.githubusercontent.com/29705928/42725317-dce4a9f2-87bc-11e8-81f7-1a7a16c8918f.png
)

- 일정 공유
![image](https://user-images.githubusercontent.com/29705928/42725326-e8fa25fa-87bc-11e8-96b2-c708f7355dcd.png
)

### 소스코드 - chatting(client)
```
<!-- 채팅 소켓을 다른 서버에서 참조받음 -->
<script src="http://localhost:3000/socket.io/socket.io.js"></script>

//지정 namespace /chat에 접속한다
const chat = io('http://localhost:3000/chat');

//채팅방 접속 함수
chat.emit("enter room", {
	chat_seq : chat_seq,
	mem_id : message_mem_id
});

//채팅방 접속 알람 함수
chat.on("alarm entered mem_id", function(mem_id) {
	var infoBox = '<div class="enterDiv">' + mem_id + '님이 입장하셨습니다</div>';
	$('#chattingBox').append(infoBox);
});

//메세지 전송 함수
function sendMessage(){
	var message_content = $('#chattingForm textarea').val().trim();

	$('#chattingForm textarea').val('');
	$('#chattingForm textarea').focus();
	if (message_content.length == 0) {
		return;
	}
	var message_sort = "01";

	//ajax를 이용하여 메세지정보를 db에 저장
	$.ajax({
		method: "post",
		url: "${pageContext.request.contextPath}/chat/sendMessage",
		data: JSON.stringify({chat_seq : chat_seq,
							message_mem_id : message_mem_id,
							message_content : message_content,
							message_sort : message_sort,
							}),
		contentType: "application/json; charset=UTF-8",
		dataType : "json",
		success: function(data) {
			if (data != null) {
				// 서버로 자신의 메세지를 전송한다.
				chat.emit("send message", {
					chat_seq : chat_seq,
					message_mem_id : data.message_mem_id,
					message_content : data.message_content,
					message_sort : data.message_sort,
					message_dt : data.message_dt,
					message_seq : data.message_seq
				});
			}
		},
		error : function(xhr) {
			console.log(xhr);
		}
	})
}
```

### 소스코드 - chatting(server)
```
//포트열기----------------------------------------------------------
//3000포트 이용
server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});

//-----------------채팅-------------------
// namespace /chat에 접속한다.
var chat = io.of('/chat').on('connection', function(socket) {

  //채팅방에 입장한다
  socket.on('enter room', (data) => {
    var mem_id = socket.name = data.mem_id;
    var room = socket.room = data.chat_seq;

    // room에 join한다
    socket.join(room, () => {
      var rooms = Object.keys(socket.rooms);

      //유저 객체 생성
      var chat_group = {
        mem_id : mem_id,
        chat_seq : rooms[0],
        socket_id : rooms[1]
      };
      //모든 채팅방의 참가자 목록에 추가
      arrOfUser.push(chat_group);
    });
    //접속한 유저아이디를 해당 방에 출력
    chat.to(room).emit('alarm entered mem_id', mem_id);
  });

  //채팅방에 입장되어 있는 클라이언트에게 메시지를 전송한다
  socket.on('send message', (data) => {
    socket.name = data.chat_seq;
    var room = socket.room = data.chat_seq;
    chat.to(room).emit('recieve message', data);
  });

  //disconnect
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);

    for (var i = 0; i < arrOfUser.length; i++) {
      var chat_group = arrOfUser[i];
      if (chat_group.socket_id == rooms[1]) {
        // chat_seq, mem_id를 보내서 chat_group테이블의 채팅방나간시간 업데이트
        var request_url = 'http://localhost:8070/yoloCoaster/chat/disconnect?chat_seq='+chat_group.chat_seq+'&mem_id='+chat_group.mem_id;
        request(request_url, function (error, response, body) {});
        break;
      }
    };

  });
```

### 소스코드 - schedule(client)
```
// 지정 namespace /cal 에 접속한다
cal = io('http://localhost:3000/cal');

/* 스케쥴 접속 함수 */
cal.emit("enter room", {
	chat_seq : chat_seq,
	mem_id : mem_id
});

//스케쥴 드래그시 서버에 위치를 보냄
$('#chatContent').on('mousemove', '.fc-dragging', function(event){
	var topStr = $(this).css('top').replace(/[^-\d\.]/g, '');
	var left = $(this).css('left');
	var top = Number(topStr) + 60 + 'px';
	cal.emit("dragging", {top : top, left : left, mem_id : mem_id, chat_seq : chat_seq});
});

//서버로부터 drag start가 온경우
cal.on("recieve drag start", function(data) {
	var calendarTitle = $('div#calendar div.fc-center').text();
	var year = calendarTitle.slice(0,4);
	var month = calendarTitle.slice(6,8);
	console.log(year + ' .. ' + month);
	console.log(data);

	//다른 유저가 같은년도 같은 달을 보는 경우만 표시
	if((month == data.month) && (year == data.year) && (mem_id != data.mem_id)) {
		var draggingBox =
			'<div class="draggingBox" ' + 'id="' + data.mem_id + '"' +
			'style="background-color:'+ data.eventObj.color+';border-color:'+ data.eventObj.color+';color:'+data.eventObj.textColor+
			';" data-original-title="" title="">'+data.eventObj.title+'</div>';
		$('div.fc-view-container').append(draggingBox);
		console.log(draggingBox);
	}
});

//서버로부터 dragging이 온경우
cal.on("recieve dragging", function(data){
	var selector = '.draggingBox#'+data.mem_id;
	$(selector).css('top', data.top).css('left', data.left);
})

//서버로부터 drag stop이 온경우
cal.on("recieve drag stop", function(data){
	var selector = '.draggingBox#'+data.mem_id;
	$(selector).remove();
})

//서버로부터 reload page가 온경우
cal.on("recieve reload page", function(data){
	if (data.sort == 'i') {
		var insertObj = {
			id : data.obj.schedule_seq,
			title : data.obj.schedule_title,
			start : data.obj.schedule_start,
			end : moment(data.obj.schedule_end).format("YYYY-MM-DD 24"),
			color : '#'+data.obj.schedule_color,
			textColor : "black",
			allDay : true
		}
		console.log(insertObj);

		$('#calendar').fullCalendar('renderEvent', insertObj, true);
		$('#calendar').fullCalendar('refetchEvents');

	} else if(data.sort == 'm') {//수정인 경우
		var item = $("#calendar").fullCalendar('clientEvents', data.obj.schedule_seq);
			item[0].title = data.obj.schedule_title;
			item[0].start = data.obj.schedule_start;
			item[0].end = moment(data.obj.schedule_end).format("YYYY-MM-DD 24");
			item[0].color = "#"+data.obj.schedule_color;
		$("#calendar").fullCalendar('updateEvent', item[0]);
		$('#calendar').fullCalendar('refetchEvents');
	} else if(data.sort == 'd') {//드래그인 경우
		var item = $("#calendar").fullCalendar('clientEvents', data.obj.schedule_seq);
			item[0].title = data.obj.schedule_title;
			item[0].start = data.obj.schedule_start;
			item[0].end = moment(data.obj.schedule_end).format("YYYY-MM-DD 24");
			item[0].color = data.obj.schedule_color;
		$("#calendar").fullCalendar('updateEvent', item[0]);
		$('#calendar').fullCalendar('refetchEvents');
	} else if(data.sort == 'r') {//삭제인 경우
		$('#calendar').fullCalendar('removeEvents', data.obj.schedule_seq, true);
	}
});

```


### 소스코드 - schedule(server)
```
  //---------------------캘린더 공유 서버(fullCalendar와 사용)--------------------------------------------------------
  // namespace /cal에 접속한다.
  var cal = io.of('/cal').on('connection', function(socket) {
    //캘린더방에 입장한다
    socket.on('enter room', (data) => {
      socket.name = data.mem_id;
      var room = socket.room = data.chat_seq;
      // room에 join한다
      socket.join(room);
    });

    //drag start를 받고
    //해당 캘린더방에 입장되어 있는 클라이언트에게 recieve drag start를 전송한다
    socket.on('drag start', (data) => {
      socket.name = data.mem_id;
      var room = socket.room = data.chat_seq;
      cal.to(room).emit('recieve drag start', data);
    });

    //draggig을 받고
    //해당 캘린더방에 입장되어 있는 클라이언트에게 recieve dragging을 전송한다
    socket.on('dragging', (data) => {
      socket.name = data.mem_id;
      var room = socket.room = data.chat_seq;
      cal.to(room).emit('recieve dragging', data);
    });

    //drag stop를 받고
    //해당 캘린더방에 입장되어 있는 클라이언트에게 recieve drag stop을 전송한다
    socket.on('drag stop', (data) => {
      socket.name = data.mem_id;
      var room = socket.room = data.chat_seq;
      cal.to(room).emit('recieve drag stop', data);
    });

    //reload page를 받고
    //해당 캘린더방에 입장되어 있는 클라이언트에게 recieve reload page을 전송한다
    socket.on('reload page', (data) => {
      socket.name = data.mem_id;
      var room = socket.room = data.chat_seq;
      cal.to(room).emit('recieve reload page', data);
    });

    //calendar방 disconnect
    socket.on('disconnecting', (reason) => {
      //console.log('user calendar disconnected : ' + reason);
    });
  });
});
```
