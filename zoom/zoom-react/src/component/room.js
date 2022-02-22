import { useState } from "react";

export default function Room() {
    return (
        <div>
            <form>
                <input placeholder="room name" required type="txt"></input>
                <button>Enter room</button>
            </form>
        </div>

    );
}