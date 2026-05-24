import React from 'react';

const EventModal = ({ event, onChoice }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
          <h2 className="text-2xl font-black text-white tracking-tight px-6 text-center uppercase">{event.title}</h2>
        </div>
        <div className="p-8">
          <p className="text-slate-300 mb-8 leading-relaxed italic text-lg">
            "{event.description}"
          </p>
          <div className="space-y-3">
            {event.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => onChoice(choice)}
                className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all text-left group"
              >
                <div className="font-bold text-slate-100 group-hover:text-blue-400">{choice.text}</div>
                <div className="text-[10px] uppercase text-slate-500 font-black mt-1">
                  {choice.consequence.gold !== 0 && `Gold: ${choice.consequence.gold > 0 ? '+' : ''}${choice.consequence.gold} `}
                  {choice.consequence.troops !== 0 && `Troops: ${choice.consequence.troops > 0 ? '+' : ''}${choice.consequence.troops}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
