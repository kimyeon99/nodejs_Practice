import { useState } from "react";
import chatMessage from "./chatMessage";
import axios from 'axios';
import { useEffect } from "react";
import "../App.css";
import io from 'socket.io-client';
import { useRef } from 'react'


export default function RoomChat() {
    const [chat, setChat] = useState({ name: "", content: "" });
    const [chatArr, setChatArr] = useState([]);
    const [user, setUser] = useState(chat.name);
    const socketRef = useRef();


    useEffect(() => {
        socketRef.current = io.connect('http://localhost:3000');
        socketRef.current.on('welcome', () => {
            console.log('somemone joined');
        });
        socketRef.current.on('add_message', (content) => {
            setChatArr((chatArr) => chatArr.concat(content));
        });
        console.log('enter_room');
        return () => {
            socketRef.current.close();
        };
    }, []);


    function sendMessage(e) {
        e.preventDefault();
        // socketRef.current.emit('send_message', { name: chat.name, content: chat.content });
        while (true) {
            socketRef.current.emit('send_message', { name: { x: 1.99999564614121231313, y: 0.1492123123, z: 2.5823291232813812398 } });
        }
    }






    return (
        <div className="box">
            <div className="chatArea">
                {chatArr.map((ele) => (
                    <div className="chat">
                        <div>{ele.name}</div>
                        <div className="chatLog">{ele.message}</div>
                    </div>
                ))}
            </div>
            <form className="input" onSubmit={sendMessage}>
                <input type="text" value={chat.name} onChange={(e) => { setChat({ name: e.target.value, content: chat.content }) }} placeholder="이름"></input>
                <input type="text" value={chat.content} onChange={(e) => { setChat({ name: chat.name, content: e.target.value }) }} placeholder="내용"></input>
                <button>등록</button>
            </form>

        </div>
    );
}