import './App.css';
import { useState } from "react";
import Video from './component/video';
import Room from './component/room';
import RoomChat from './component/roomChat';

function App() {
  return (
    <div className="App">
      <RoomChat />
    </div>
  );
}

export default App;
