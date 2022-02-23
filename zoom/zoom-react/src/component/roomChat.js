import { useState } from "react";
import chatMessage from "./chatMessage";
import axios from 'axios';
import { useEffect } from "react";
import "../App.css";


export default function RoomChat() {
    const [chat, setChat] = useState({ name: "", content: "" });
    const [chatArr, setChatArr] = useState([]);
    useEffect(() => {
        console.log('aaaa');
        axios.get(
            '/getMessages'
        ).then((res) => {
            console.log(res);
        })
        return () => {
            console.log('컴포넌트가 화면에서 사라짐');
        };
    }, []);

    function sendMessage(e) {
        e.preventDefault();
        console.log('content', chat.content);
        try {
            axios.post('/sendMessage', {
                // headers: { 'Content-type': 'application/json' },
                name: chat.name,
                content: chat.content,
            }).then(function (result) {
                {
                    if (result.data) {
                        console.log(result);
                        setChat({ name: chat.name, content: '' });
                    } else {
                        console.log('삐빅');
                    }
                }
            });
        } catch (error) {
            console.error(error);
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