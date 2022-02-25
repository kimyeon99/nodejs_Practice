import { useState } from "react";
import chatMessage from "./chatMessage";
import axios from 'axios';
import { useEffect } from "react";
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

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:3000');
        console.log('you joined');
        return () => {
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('welcome', () => {
            console.log('somemone joined');
            setUsers(users + 1);
            console.log('현재 유저 수:', users);
        });
        socketRef.current.on('new_message', addMessage);
        socketRef.current.on('disconnect', () => {
            setUsers(users - 1);
            console.log('someone left');
            console.log('현재 유저 수:', users);
        })
    }, []);



    function sendMessage(e) {
        e.preventDefault();
        socketRef.current.emit('new_message', message, () => {
            addMessage(`you: ${message}`);
        });
        setMessage('');
    }

    function addMessage(msg) {
        setChatLog(chatLog.concat(msg));
    }



    return (
        <div className="box">
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
                <input type="text" onChange={(e) => { setMessage(e.target.value) }} placeholder="내용"></input>
                <button onClick={sendMessage}>등록</button>
            </form>

        </div>
    );
}