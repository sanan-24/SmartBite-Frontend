import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPaperPlane, faTimes, faRobot } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      // Note: Assuming there's a /chat endpoint as per original file
      const res = await axios.post('http://localhost:5000/api/chat', { message: userMsg.text });
      const botReply = res.data.reply || "I'm here to help you discover the best food on SmartBite!";
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: 'Connecting to SmartBite assistant...' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-2xl shadow-xl z-50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-primary/20"
        aria-label="Open chat"
      >
        <FontAwesomeIcon icon={open ? faTimes : faComments} className="text-xl" />
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col animate-fade-up">
          <div className="p-4 bg-primary text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-sm" />
               </div>
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest leading-none">SmartBite Assistant</h3>
                  <p className="text-[9px] text-white/60 mt-1 uppercase font-medium">Online for support</p>
               </div>
            </div>
          </div>

          <div className="p-4 h-80 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/50">
             {messages.length === 0 && (
               <div className="text-center py-6">
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed px-6 italic">
                    "Assalam-o-Alaikum! I'm your SmartBite Advisor. Ask me about trending foods, healthy options, or diet-friendly meals!"
                  </p>
               </div>
             )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] max-w-[85%] shadow-sm ${
                  m.from === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white text-neutral-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-50 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 input-field h-11"
              placeholder="How can we help you today?"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()} 
              className="w-11 h-11 bg-primary text-white rounded-xl shadow-lg shadow-primary/10 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
