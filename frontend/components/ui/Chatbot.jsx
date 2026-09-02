'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const { t, lang } = useLang();

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      if (messages.length === 0) {
        setMessages([{ role: 'bot', content: t('chatbot', 'greeting') }]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = ['Iron price?', 'Schedule pickup', 'What items?', 'Payment?'];

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Mock API call if real backend not ready
      const res = await api.post('/chat', { message: msg, history: newMessages.slice(-10), lang }).catch(() => ({ data: { reply: 'Thanks for reaching out! Our team will contact you shortly.' } }));
      setMessages([...newMessages, { role: 'bot', content: res.data.reply }]);
    } catch (err) {
      toast.error('Failed to get response');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 relative"
        >
          <Bot className="h-6 w-6" />
          {hasUnread && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[370px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-orange-400 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-primary"></span>
              </div>
              <div>
                <h3 className="font-semibold">KabadiBot</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm self-end' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm self-start'}`}>
                {m.content}
              </div>
            ))}
            {isTyping && (
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm self-start flex gap-1 w-16">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {quickReplies.map(qr => (
              <button key={qr} onClick={() => handleSend(qr)} className="text-xs bg-primary-light text-primary-dark px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors shrink-0">
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot', 'placeholder')}
              className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={() => handleSend()} className="bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
