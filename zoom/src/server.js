import http from "http"
const express = require('express');
const app = express();
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
const path = require('path');
import cors from 'cors';
const maria = require('./maria');
app.use(cors());


app.use(express.urlencoded({ extended: false }));

//app.set("view engine", "pug");
//app.set("views", __dirname + "/public/views");
app.use(express.static(path.join(__dirname, "../zoom-react/build")));

//app.get("/", (_, res) => res.render("home"));
app.get("/test2", function (요청, 응답) {
    응답.sendFile(path.join(__dirname, '../zoom-react/build/index.html'))
});


app.get("/getMessages", function (req, res) {
    try {
        const sql = 'SELECT count(*) from messages';
        maria.query(sql, function (err, rows, fields) {
            if (!err) {
                res.json(true);
            } else {
                console.log(err);
                res.json(false);
            }
        });
    } catch (e) {
        console.log(e);
        res.json(false);
    }
});

app.post("/sendMessage", function (req, res) {
    try {
        console.log('!!!', req.body);
        const data = req.body;
        const sql = 'INSERT INTO messages(user_id, content) values ';
        const sqlValue = `("${data.user_id}", "${data.content}");`;
        maria.query(sql + sqlValue, function (err, rows, fields) {
            if (!err) {
                res.json(true);
            } else {
                console.log(err);
                res.json(false);
            }
        });
    } catch (e) {

    }
});

//redisClient.zIncrBy('dungeon_rank', 150, '예승재');

// http, ws 동시 지원
const httpServer = http.createServer(app);
//const wsServer = new Server(httpServer); 
const wsServer = new Server(httpServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        //send message to room
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
});





const handleListen = () => console.log(`on 3000`);
httpServer.listen(3000, handleListen);


// function publicRooms() {
//     const sids = wsServer.sockets.adapter.sids;
//     const rooms = wsServer.sockets.adapter.rooms;
//     const publicRooms = [];
//     rooms.forEach((_, key) => {
//         if (sids.get(key) === undefined) {
//             publicRooms.push(key);
//         }
//     });
//     return publicRooms;
// }

// function countRoom(roomName) {
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size
// }

// function userRanking() {
//     return redisClient.ZREVRANGE("ranking:myRank", 0, -1, 'WITHSCORES', PrintRedisRank);
// }

//socket.io
// wsServer.on("connection", (backSocket) => {
//     backSocket['name'] = "Anon";
//     backSocket['score'] = 0;
//     backSocket.onAny((event) => {
//         console.log(`Socket Event: ${event}`);
//     });
//     backSocket.on("enter_room", (roomName, done) => {
//         //redisClient.zadd("sers", 9926, "a", 3426, "b", 2465, "c", 2826, "d", 1514, "e", 12137 ,"f")
//         //redisClient.ZREVRANGE("users", 0, -1, 'WITHSCORES', PrintRedisRank);
//         console.log(roomName);
//         backSocket.join(roomName);
//         done();
//         backSocket.to(roomName).emit("welcome", backSocket.name, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     backSocket.on("disconnecting", () => {
//         backSocket.rooms.forEach(room =>
//             backSocket.to(room).emit("bye", backSocket.name, countRoom(room) - 1)// 방을 나가기 전이기 때문
//         );
//     });
//     backSocket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     })
//     backSocket.on("new_message", (msg, room, done) => {
//         backSocket.to(room).emit("new_message", `${backSocket.name} : ${msg}`);
//         done();
//     });
//     backSocket.on("new_user", (score, room) => {
//         backSocket.to(room).emit("new_user", `${backSocket.name} : ${score}`);
//     })
//     backSocket.on("name", (name) => backSocket['name'] = name);
//     backSocket.on("score", (score) => backSocket['score'] = score);
// });

