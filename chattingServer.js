//서버 설정-------------------------------------------------------------
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var request = require('request');
var server = http.createServer(app);
var io = require('socket.io')(server);


//출력폴더
app.set('views', __dirname + '/client');
//표현방식 ejs
app.set('view engine', 'ejs');


//=================================================================================
//채팅방내의 인원
var numOfUser = 0;

//모든 채팅방의 참가자 목록
var arrOfUser = new Array();

//=================================================================================
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
    // console.log('user disconnected : ' + reason);
    let rooms = Object.keys(socket.rooms);//[ '24', '/chat#1PCcgUtXuFohUmv7AAAA' ]
    // console.log(rooms)

    for (var i = 0; i < arrOfUser.length; i++) {
      var chat_group = arrOfUser[i];
      if (chat_group.socket_id == rooms[1]) {
        // console.log(chat_group);

        // chat_seq, mem_id를 보내서 chat_group테이블의 채팅방나간시간 업데이트
        var request_url = 'http://localhost:8070/yoloCoaster/chat/disconnect?chat_seq='+chat_group.chat_seq+'&mem_id='+chat_group.mem_id;
        request(request_url, function (error, response, body) {
        });
        break;
      }
    };

  });

});

//---------------------캘린더 공유 서버--------------------------------------------------------
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





//포트열기----------------------------------------------------------
//3000포트 이용
server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});
