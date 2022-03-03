import http from "http"
const express = require('express');
const app = express();
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
const path = require('path');
import cors from 'cors';
const maria = require('./maria');
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//app.set("view engine", "pug");
//app.set("views", __dirname + "/public/views");
app.use(express.static(path.join(__dirname, "../zoom-react/build")));

//app.get("/", (_, res) => res.render("home"));
// app.get("/test2", function (요청, 응답) {
//     응답.sendFile(path.join(__dirname, '../zoom-react/build/index.html'))
// });


app.get("/getMessages", function (req, res) {
    try {
        const sql = 'SELECT count(*) from messages';
        maria.query(sql, function (err, rows, fields) {
            if (!err) {
                res.json(true);
                console.log('suc');
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
        const data = req.body;
        const sql = 'INSERT INTO messages(name, content) values ';
        const sqlValue = `("${data.name}", "${data.content}");`;
        console.log('req: ', req.body);
        maria.query(sql + sqlValue, function (err, rows, fields) {
            if (!err) {
                res.json(true);
            } else {
                console.log(err);
                res.json(false);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

//redisClient.zIncrBy('dungeon_rank', 150, '예승재');

// http, ws 동시 지원
const httpServer = http.createServer(app);
//const wsServer = new Server(httpServer); 
const wsServer = new Server(httpServer);

function publics() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publics = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publics.push(key);
        }
    });
    return publics;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

const list = {
    a: { a_public_1: [1, 2], a_public_2: [3, 4] },
}

wsServer.on("connection", socket => {
    socket["nickname"] = '';
    socket['roomName'] = '';
    socket['publicRoom'] = '';
    //socket['list'] = { id: 'a', members: ['test1', 'test2'] }
    // socket['users'] = [{ id: '', members: ['test1'] },]
    socket.onAny((event) => {
        //console.log(wsServer.sockets.adapter);
        console.log(`socket event : ${event}`);
    });
    socket.on("join_room", (roomName, userName) => {
        socket['nickname'] = userName;
        socket['roomName'] = roomName;
        socket.join(roomName);

        // console.log('list[a][publicRoom].size', list[roomName][publicRoom].length);
        console.log('list', list);

        for (let i = 1; ; i++) {
            const publicRoom = roomName + '_public_' + i;
            // public이 존재하지 않을 경우
            if (!list[roomName]) {
                list[roomName] = [];
                list[roomName][publicRoom] = [userName];
                socket['publicRoom'] = publicRoom;
                //userList 발사
                break;
            }
            //콘서트가 존재할 경우
            else if (list[roomName][publicRoom]) {
                // 콘서트가 존재하고, 사용자가 3명 이하일 경우 접속
                if (list[roomName][publicRoom].length <= 2) {
                    socket.join(publicRoom);
                    list[roomName][publicRoom].push(userName);
                    socket['publicRoom'] = publicRoom;
                    //userList 발사
                    break;
                }
                // 그렇지 않을 경우 i++해서 public_i 숫자 올려서 반복.
            }
            // custom room이 존재하지 않을 경우
            else {
                list[roomName][publicRoom] = [userName];
                socket['publicRoom'] = publicRoom;
                //userList 발사
                break;
            }
        }
        socket.to(roomName).emit('userList', list[socket.roomName]);
        console.log('just list', list[socket.roomName]);
        socket.to(roomName).emit('publicUserList', list[socket.roomName][socket.publicRoom]);
        // socket.to(roomName).emit("welcome", list);
        console.log('server users list: ', list);

    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("userList", (done) => {
        done(list[socket.roomName]);
    });
    socket.on("publicUserList", (done) => {
        done(list[socket.roomName][socket.publicRoom]);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
    socket.on("new_message", (roomName, msg, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
        console.log(socket.rooms);
        done();
    });

    socket.on("disconnecting", () => {
        const roomName = socket['roomName'];
        const publicRoom = socket['publicRoom']

        if (socket.rooms.size > 1) {
            for (let i = 0; ; i++) {
                if (list[roomName][publicRoom][i] == socket['nickname']) {
                    list[roomName][publicRoom].splice(i, 1);
                    console.log('after rooms', list);
                    break;
                }
            }
        }


        // if (socket.rooms.size > 1) {
        //     for (let i = 0; ; i++) {
        //         const publicRoom = roomName + '_public_' + i;

        //         if (list[roomName][publicRoom] == socket['nickname']) {
        //             list[roomName][publicRoom].splice(i, 1);
        //             // socket.leave(publicRoom);
        //             console.log('disconnecting', list);

        //             break;
        //         }
        //     }
        // }
    })
});





const handleListen = () => console.log(`on 3001`);
httpServer.listen(3001, handleListen);


// function publics() {
//     const sids = wsServer.sockets.adapter.sids;
//     const rooms = wsServer.sockets.adapter.rooms;
//     const publics = [];
//     rooms.forEach((_, key) => {
//         if (sids.get(key) === undefined) {
//             publics.push(key);
//         }
//     });
//     return publics;
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
//         wsServer.sockets.emit("room_change", publics());
//     });
//     backSocket.on("disconnecting", () => {
//         backSocket.rooms.forEach(room =>
//             backSocket.to(room).emit("bye", backSocket.name, countRoom(room) - 1)// 방을 나가기 전이기 때문
//         );
//     });
//     backSocket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publics());
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

