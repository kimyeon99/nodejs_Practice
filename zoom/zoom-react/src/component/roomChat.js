import { useState } from "react";
import chatMessage from "./chatMessage";
import axios from 'axios';
import { useEffect } from "react";
import { useCallback } from "react";
import "../App.css";
import io from 'socket.io-client';
import { useRef } from 'react'
import ReactDOM from 'react-dom';
import React from 'react';

export default function RoomChat() {
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);
    //const [chatArr, setChatArr] = useState([]);
    const socketRef = useRef();
    const chatArea = document.getElementById("chatArea");
    const [users, setUsers] = useState(0);
    const [roomName, setRoomName] = useState('public');
    const [nickname, setNickname] = useState('누군가');

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:3000');
        socketRef.current.emit('join_room', roomName);
        return () => {
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('welcome', (members) => {
            console.log('somemone joined');
            setUsers(users + 1);
            console.log('유저 목록:', members);
        });
        socketRef.current.on('new_message', addMessage);
        socketRef.current.on('disconnect', () => {
            setUsers(users - 1);
            console.log('someone left');
        });
    }, []);

    // const sendMessage = useCallback((e) => {
    //     e.preventDefault();
    //     socketRef.current.emit('new_message', message, () => {
    //         addMessage(`you: ${message}`);
    //     });
    //     setMessage('');
    // }, []);



    function sendMessage(e) {
        e.preventDefault();
        socketRef.current.emit('new_message', roomName, message, () => {
            addMessage(`you: ${message}`);
        });
        setMessage('');
    }

    function addMessage(msg) {
        setChatLog(chatLog.concat(msg));
    }

    function enterRoom(e) {
        e.preventDefault();
        socketRef.current.emit('join_room', roomName);
    }



    return (
        <div className="box">
            <form className="main">
                <input type="text" value={roomName} onChange={(e) => { setRoomName(e.target.value) }} placeholder="roomName"></input>
                <input type="text" value={nickname} onChange={(e) => { setNickname(e.target.value) }} placeholder="nickname"></input>
                <button onClick={enterRoom}>등록</button>
            </form>
            <p>{roomName}</p>
            <div className="chatArea">
                {
                    chatLog.map((element) => {
                        return (
                            <div>
                                <a>{element}</a>
                                <hr />
                            </div>
                        )
                    })
                }
            </div>
            <form className="input">
                {/* <input type="text" value={chat.name} onChange={(e) => { setChat({ name: e.target.value, content: chat.content }) }} placeholder="이름"></input> */}
                <input type="text" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="내용"></input>
                <button onClick={sendMessage}>등록</button>
            </form>

        </div>
    );
}