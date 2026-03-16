import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import EmotionCapture from './components/EmotionCapture';

export default function App(){
  const [lastEmotion, setLastEmotion] = useState(null);

  function handleEmotion(data){
    console.log('emotion', data);
    setLastEmotion(data);
  }

  return (
    <div className="container">
      <h1>AI Smart Learning — Demo</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="chat-box">
            <h2>AI Tutor</h2>
            <Chatbot emotion={lastEmotion} />
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div className="chat-box">
            <h2>Emotion Capture</h2>
            <EmotionCapture onEmotion={handleEmotion} />
            { lastEmotion && <div style={{ marginTop: 10 }}>
              <strong>Last emotion:</strong> {lastEmotion.emotion} ({(lastEmotion.confidence||0).toFixed(2)})
            </div> }
          </div>
        </div>
      </div>
    </div>
  );
}
