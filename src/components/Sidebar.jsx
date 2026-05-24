import React from 'react';
import { Users, Shield, TrendingUp, Sword, Plane, Truck, MessageSquare, Landmark, Info } from 'lucide-react';
import { UNIT_TYPES } from '../hooks/useGameState';

const Sidebar = ({ selectedProvince, gameState, onAttackMode, isAttackMode, attackingFrom, onOpenDiplomacy }) => {
  const { gold, turn, nextTurn, playerNation, recruit, history } = gameState;

  return (
    <div className="w-[340px] glass-panel border-l border-white/5 flex flex-col h-full shadow-2xl z-20">
      <div className="p-8 border-b border-white/5">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tighter flex items-center">
          <Shield className="mr-3 text-blue-500" size={28} strokeWidth={2.5} />
          PAX HISTORIA
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {selectedProvince ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Territory Header */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5 shadow-inner overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <GlobeIcon size={120} />
              </div>
              <h2 className="text-2xl font-black mb-1 tracking-tight">{selectedProvince.name}</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${selectedProvince.owner === playerNation ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-red-400'}`}></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                  {selectedProvince.owner} Jurisdiction
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<Users size={18}/>} label="Strength" value={selectedProvince.troops} color="text-blue-400" />
              <StatCard icon={<TrendingUp size={18}/>} label="Economy" value={`+${selectedProvince.income || 5}`} color="text-emerald-400" />
            </div>

            {/* Actions */}
            <div className="space-y-6 pt-2">
              {selectedProvince.owner === playerNation ? (
                <>
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black flex items-center">
                      <Landmark size={12} className="mr-2" />
                      Military Mobilization
                    </p>
                    <div className="space-y-2">
                      <RecruitButton
                        onClick={() => recruit(selectedProvince.id, 'INFANTRY')}
                        unit={UNIT_TYPES.INFANTRY}
                        icon={<Users size={16}/>}
                        gold={gold}
                      />
                      <RecruitButton
                        onClick={() => recruit(selectedProvince.id, 'TANKS')}
                        unit={UNIT_TYPES.TANKS}
                        icon={<Truck size={16}/>}
                        gold={gold}
                      />
                      <RecruitButton
                        onClick={() => recruit(selectedProvince.id, 'AIR_FORCE')}
                        unit={UNIT_TYPES.AIR_FORCE}
                        icon={<Plane size={16}/>}
                        gold={gold}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onAttackMode(selectedProvince.id)}
                    className={`w-full py-4 ${isAttackMode && attackingFrom === selectedProvince.id ? 'bg-orange-600 shadow-orange-900/40' : 'bg-red-600 hover:bg-red-500 shadow-red-900/40'} rounded-xl font-black text-sm tracking-[0.1em] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-red-900/20 uppercase`}
                  >
                    <Sword size={20} />
                    <span>{isAttackMode && attackingFrom === selectedProvince.id ? 'Abort Mission' : 'Commence Attack'}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                   <button
                    onClick={onOpenDiplomacy}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-sm tracking-[0.1em] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-indigo-900/30 uppercase"
                  >
                    <MessageSquare size={20} />
                    <span>Open Negotiations</span>
                  </button>
                  {isAttackMode && (
                    <button
                      onClick={() => onAttackMode(null, selectedProvince.id)}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-black text-sm tracking-[0.1em] flex items-center justify-center space-x-3 transition-all animate-pulse"
                    >
                      <Sword size={20} />
                      <span>Confirm Invasion</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 px-8 text-center italic">
            <div className="p-4 rounded-full bg-slate-900/50 border border-white/5">
               <Info size={32} />
            </div>
            <p className="text-sm leading-relaxed">System awaiting territory selection. Satellite imagery standing by.</p>
          </div>
        )}

        {/* History / Intel */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-4 flex items-center">
            <ActivityIcon size={12} className="mr-2" />
            Live Intelligence
          </p>
          <div className="space-y-3">
            {history.slice(0, 4).map((log, i) => (
              <div key={i} className="text-[11px] p-4 bg-slate-900/40 border border-white/5 rounded-xl text-slate-400 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-slate-900/60 border-t border-white/5">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Treasury</p>
            <div className="flex items-baseline space-x-1">
               <span className="text-2xl font-black text-yellow-500 tracking-tighter">{gold}</span>
               <span className="text-[10px] font-bold text-yellow-600/50 uppercase">Credits</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Timeline</p>
            <span className="text-2xl font-black text-white tracking-tighter">Day {turn}</span>
          </div>
        </div>
        <button
          onClick={nextTurn}
          className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl font-black text-lg tracking-[0.2em] shadow-xl shadow-emerald-950/40 transition-all active:scale-95 uppercase border-t border-white/20"
        >
          Execute Cycle
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl shadow-inner">
    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">{label}</p>
    <div className="flex items-center space-x-3">
      <div className={`p-2 bg-slate-800 rounded-lg ${color}`}>
        {icon}
      </div>
      <p className="font-black text-xl tracking-tight">{value}</p>
    </div>
  </div>
);

const RecruitButton = ({ onClick, unit, icon, gold }) => (
  <button
    onClick={onClick}
    disabled={gold < unit.cost}
    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 disabled:opacity-30 rounded-xl transition-all group"
  >
    <div className="flex items-center">
      <div className="p-2 bg-slate-900 rounded-lg mr-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{unit.name}</span>
    </div>
    <div className="flex items-center space-x-2">
       <span className="text-[10px] font-black text-yellow-500/80">{unit.cost}</span>
       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
    </div>
  </button>
);

const GlobeIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/>
  </svg>
);

const ActivityIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default Sidebar;
