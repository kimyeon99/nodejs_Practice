import { useState } from "react";

export default function Video() {
    //const day = useParams().day;

    // const wordList = dummy.words.filter(word => (
    //     word.day == day
    // ));

    return (
        <div>
            <video className="myFace" controls width="250" height="300" autoPlay playsInline>
            </video>
            <br />
            <button className="mute">Mike Mute</button>
            <button className="camera">Camera Off</button>
            <select className="cameras" />
        </div>

    );
}