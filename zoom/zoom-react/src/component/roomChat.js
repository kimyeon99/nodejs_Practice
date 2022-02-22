import { useState } from "react";
import chatMessage from "./chatMessage";
import axios from 'axios';
import { useEffect } from "react";


export default function RoomChat() {
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

    function sendMessage() {
        try {
            axios.post('sendMessage', {
                //보내고자 하는 데이터 
                user_id: "1",
                content: "안녕하세요"
            }).then(function (result) {
                {
                    if (result.data) {
                        console.log(result);
                    } else {
                        console.log('삐빅');
                    }
                }
            });
        } catch (error) {
            //응답 실패
            console.error(error);
        }
    }

    return (
        <div>
            <div className="chatArea" style={{
                width: "500px",
                height: "600px",
                backgroundColor: "beige"
            }}>
                {/* {messages.map(id => (
                    <li key={id}>
                        <chatMessage></chatMessage>
                    </li>
                ))} */}

            </div>
            <input></input>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}