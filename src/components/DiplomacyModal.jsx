import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import axios from 'axios';

const DiplomacyModal = ({ targetProvince, onClose, addHistory }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'player', text: userMsg }]);

    try {
      const response = await axios.post('http://localhost:3001/api/diplomacy', {
        message: userMsg,
        nation: targetProvince.owner,
        leaderType: 'Aggressive', // Could be randomized
        playerStatus: 'Growing Power'
      });

      setChat(prev => [...prev, { role: 'leader', text: response.data.response }]);
      addHistory(`Diplomacy with ${targetProvince.owner}: ${response.data.action}`);
    } catch (e) {
      setChat(prev => [...prev, { role: 'leader', text: "We have nothing to say to you." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center border border-red-500/30">
              <MessageSquare className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Diplomatic Channel: {targetProvince.owner}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Status: Neutral / Tense</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white font-bold">ESC</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'player' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-slate-500 animate-pulse text-xs font-bold uppercase tracking-widest">TRANSMITTING...</div>}
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter your proposal (e.g., 'Let us form an alliance' or 'Pay us tribute')..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-6 pr-16 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiplomacyModal;
