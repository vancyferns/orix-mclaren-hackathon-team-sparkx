// client/src/components/FloatingChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, Link as LinkIcon, History, ChevronLeft, MessageCircle } from 'lucide-react';

const FloatingChatBot = ({ onJumpRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', content: 'Ask me anything about this PDF.' }]);
  const [input, setInput] = useState('');
  
  // Mock History Data
  const [chatHistory] = useState([
    { id: 1, title: 'Q3 Revenue Analysis', date: '2 hours ago' },
    { id: 2, title: 'Debt Maturity Interrogation', date: 'Yesterday' },
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: 'I found a matching metric on page 4.', sourcePage: 4 }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 h-[500px] bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 duration-300 ring-1 ring-black/20">
          
          {/* Header */}
          <div className="p-4 bg-indigo-600 flex justify-between items-center shrink-0 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                AI Interrogator
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-dot-pattern p-4 space-y-4">
             {messages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-lg ${
                   msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                 }`}>
                   {msg.content}
                 </div>
               </div>
             ))}
             <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form className="p-4 bg-slate-900/90 border-t border-slate-800/50 backdrop-blur-md" onSubmit={handleSubmit}>
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Interrogate document..."
                className="w-full bg-slate-800 text-white text-[11px] rounded-2xl py-2.5 px-4 pr-10 outline-none border border-slate-700 focus:border-indigo-500 transition-all" 
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(79,70,229,0.3)] transition-all duration-500 ease-out transform hover:scale-110 active:scale-90 ${
          isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default FloatingChatBot;