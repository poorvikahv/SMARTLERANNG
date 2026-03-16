import React, { useState } from 'react';

export default function Chatbot({ emotion }) {
  const [messages, setMessages] = useState([
    {sender:'bot', text: 'Hi! I am your AI tutor. Ask me anything.'}
  ]);
  const [input, setInput] = useState('');

  async function sendMsg(){
    if (!input.trim()) return;
    const u = { sender:'user', text: input };
    setMessages(m => [...m, u]);
    const payload = { message: input };
    if (emotion && emotion.emotion) payload.emotion = emotion.emotion;
    setInput('');
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE + '/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      setMessages(m => [...m, { sender:'bot', text: j.reply }]);
    } catch (err) {
      setMessages(m => [...m, { sender:'bot', text: 'Error: Could not reach server' }]);
    }
  }

  return (
    <div>
      <div style={{height: 340, overflow:'auto', padding:8, border:'1px solid #eee', borderRadius:6, background:'#fafafa'}}>
        {messages.map((m,i) => (
          <div key={i} style={{ textAlign: m.sender === 'user' ? 'right' : 'left', margin: '6px 0' }}>
            <div style={{ display:'inline-block', padding:'8px 12px', borderRadius:12, background: m.sender === 'user' ? '#b3e5fc' : '#eee' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display:'flex', gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1, padding:8}} placeholder="Ask me..." />
        <button onClick={sendMsg} style={{padding:'8px 12px'}}>Send</button>
      </div>
    </div>
  );
}
