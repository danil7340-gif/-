import React from 'react';
import { Users, Shield, TrendingUp, Sword, Plane, Truck, MessageSquare } from 'lucide-react';
import { UNIT_TYPES } from '../hooks/useGameState';

const Sidebar = ({ selectedProvince, gameState, onAttackMode, isAttackMode, attackingFrom, onOpenDiplomacy }) => {
  const { gold, turn, nextTurn, playerNation, recruit, history } = gameState;

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 p-6 flex flex-col h-full shadow-2xl z-20">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <h1 className="text-2xl font-black mb-8 text-blue-400 tracking-tighter flex items-center">
          <Shield className="mr-2" size={24} />
          PAX HISTORIA
        </h1>

        {selectedProvince ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-xl">
              <h2 className="text-xl font-bold mb-1">{selectedProvince.name}</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Controlled by: <span className={selectedProvince.owner === playerNation ? 'text-blue-400' : 'text-red-400'}>
                  {selectedProvince.owner}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/40 border border-slate-700 rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Strength</p>
                <div className="flex items-center space-x-2">
                  <Users className="text-blue-400" size={16} />
                  <p className="font-black text-lg">{selectedProvince.troops}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-900/40 border border-slate-700 rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Economy</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-green-400" size={16} />
                  <p className="font-black text-lg">+{selectedProvince.income || 5}</p>
                </div>
              </div>
            </div>

            {selectedProvince.owner === playerNation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Military Recruitment</p>
                  <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => recruit(selectedProvince.id, 'INFANTRY')} disabled={gold < UNIT_TYPES.INFANTRY.cost} className="flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors group">
                      <div className="flex items-center"><Users size={16} className="mr-2 text-blue-300" /><span className="text-sm font-semibold">Infantry</span></div>
                      <span className="text-xs font-bold text-yellow-500">50 G</span>
                    </button>
                    <button onClick={() => recruit(selectedProvince.id, 'TANKS')} disabled={gold < UNIT_TYPES.TANKS.cost} className="flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors group">
                      <div className="flex items-center"><Truck size={16} className="mr-2 text-slate-300" /><span className="text-sm font-semibold">Tanks</span></div>
                      <span className="text-xs font-bold text-yellow-500">150 G</span>
                    </button>
                    <button onClick={() => recruit(selectedProvince.id, 'AIR_FORCE')} disabled={gold < UNIT_TYPES.AIR_FORCE.cost} className="flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors group">
                      <div className="flex items-center"><Plane size={16} className="mr-2 text-sky-300" /><span className="text-sm font-semibold">Air Force</span></div>
                      <span className="text-xs font-bold text-yellow-500">300 G</span>
                    </button>
                  </div>
                </div>

                <button onClick={() => onAttackMode(selectedProvince.id)} className={`w-full py-3 ${isAttackMode && attackingFrom === selectedProvince.id ? 'bg-orange-600' : 'bg-red-600 hover:bg-red-500'} rounded-lg font-bold flex items-center justify-center space-x-2 transition-all`}>
                  <Sword size={18} />
                  <span>{isAttackMode && attackingFrom === selectedProvince.id ? 'CANCEL ATTACK' : 'ATTACK'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={onOpenDiplomacy}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/20"
                >
                  <MessageSquare size={18} />
                  <span>NEGOTIATE</span>
                </button>
                {isAttackMode && (
                  <button onClick={() => onAttackMode(null, selectedProvince.id)} className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all">
                    <Sword size={18} />
                    <span>LAUNCH INVASION</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center px-4 italic">
            <p>Select a province to interact.</p>
          </div>
        )}

        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">Intelligence Report</p>
          <div className="space-y-2">
            {history.slice(0, 5).map((log, i) => (
              <div key={i} className="text-[11px] p-2 bg-slate-900/30 border-l-2 border-blue-500/50 rounded text-slate-400">{log}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex justify-between items-center mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Treasury</span>
            <span className="text-yellow-400 font-black text-xl">{gold} <span className="text-xs font-normal">G</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Turn</span>
            <span className="text-white font-black text-xl">{turn}</span>
          </div>
        </div>
        <button onClick={nextTurn} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-lg tracking-widest shadow-lg shadow-emerald-900/40 transition-all uppercase">End Turn</button>
      </div>
    </div>
  );
};

export default Sidebar;
