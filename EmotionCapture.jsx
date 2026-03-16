import React, { useRef } from 'react';

export default function EmotionCapture({ onEmotion }){
  const videoRef = useRef(null);

  async function startCam(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      alert('Camera permission denied or not available.');
      console.error(err);
    }
  }

  async function captureAndSend(){
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = vid.videoWidth || 320;
    canvas.height = vid.videoHeight || 240;
    canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/png');

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE + '/api/emotion/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      const j = await res.json();
      if (onEmotion) onEmotion(j);
    } catch (err) {
      console.error('emotion capture error', err);
    }
  }

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', borderRadius: 8, background:'#000' }} />
      <div style={{ marginTop: 8, display:'flex', gap:8 }}>
        <button onClick={startCam}>Start Camera</button>
        <button onClick={captureAndSend}>Capture & Detect</button>
      </div>
    </div>
  );
}
