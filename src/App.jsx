import React, { useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import EventModal from './components/EventModal';
import DiplomacyModal from './components/DiplomacyModal';
import { useGameState } from './hooks/useGameState';
import { Globe, Shield, Activity, BarChart3, Radar, Zap } from 'lucide-react';

function App() {
  const gameState = useGameState();
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [attackMode, setAttackMode] = useState({ active: false, fromId: null });
  const [showDiplomacy, setShowDiplomacy] = useState(false);

  const selectedProvince = selectedProvinceId
    ? { id: selectedProvinceId, ...gameState.provinces[selectedProvinceId] }
    : null;

  const handleAttackMode = (fromId, toId = null) => {
    if (toId) {
      gameState.attack(attackMode.fromId, toId);
      setAttackMode({ active: false, fromId: null });
    } else if (fromId) {
      setAttackMode({ active: true, fromId });
    } else {
      setAttackMode({ active: false, fromId: null });
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      <main className="flex-1 relative">
        <Map
          onSelectProvince={(p) => {
            setSelectedProvinceId(p.id);
            if (!gameState.provinces[p.id]) {
              gameState.updateProvince(p.id, {
                name: p.name,
                owner: 'Neutral',
                troops: Math.floor(Math.random() * 10) + 1,
                income: 5
              });
            }
          }}
          provinces={gameState.provinces}
          playerNation={gameState.playerNation}
          selectedProvinceId={selectedProvinceId}
          attackMode={attackMode}
        />

        {/* Top HUD */}
        <div className="absolute top-0 left-0 right-0 p-8 pointer-events-none flex justify-between items-start">
          <div className="flex space-x-6">
            <div className="glass-panel p-5 rounded-2xl shadow-2xl pointer-events-auto border-white/5">
              <div className="flex items-center space-x-8">
                <HUDItem
                  icon={<Globe className="text-blue-400" size={18} />}
                  label="Global Stability"
                  value={
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                      <div className="w-3/4 h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"></div>
                    </div>
                  }
                />
                <div className="w-px h-10 bg-white/10"></div>
                <HUDItem
                  icon={<Activity className="text-red-400" size={18} />}
                  label="Tension Level"
                  value={<span className="text-xl font-black text-red-400 tracking-tighter">24.8%</span>}
                />
                <div className="w-px h-10 bg-white/10"></div>
                <HUDItem
                  icon={<Radar className="text-emerald-400" size={18} />}
                  label="Network Status"
                  value={<span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center"><Zap size={10} className="mr-1"/> Secured</span>}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto border-white/5 flex items-center space-x-4">
             <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BarChart3 className="text-indigo-400" size={18} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none mb-1">Operational Era</p>
                <p className="text-sm font-black text-white uppercase tracking-tighter">Information Age</p>
             </div>
          </div>
        </div>

        <EventModal
          event={gameState.activeEvent}
          onChoice={gameState.handleEventChoice}
        />

        {showDiplomacy && selectedProvince && (
          <DiplomacyModal
            targetProvince={selectedProvince}
            onClose={() => setShowDiplomacy(false)}
            addHistory={gameState.addHistory}
          />
        )}

        {/* Attack Mode Indicator */}
        {attackMode.active && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-xl px-10 py-4 rounded-2xl border border-red-400/50 shadow-[0_0_40px_rgba(220,38,38,0.5)] animate-bounce flex items-center">
            <Sword className="mr-4 text-white animate-pulse" size={24} />
            <div>
              <p className="text-white font-black uppercase tracking-[0.2em] text-xs leading-none mb-1">Combat Protocol Initialized</p>
              <p className="text-red-100 font-bold text-sm tracking-tight">Select target territory for invasion</p>
            </div>
          </div>
        )}
      </main>

      <Sidebar
        selectedProvince={selectedProvince}
        gameState={gameState}
        onAttackMode={handleAttackMode}
        isAttackMode={attackMode.active}
        attackingFrom={attackMode.fromId}
        onOpenDiplomacy={() => setShowDiplomacy(true)}
      />
    </div>
  );
}

const HUDItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1.5">{label}</p>
      {value}
    </div>
  </div>
);

export default App;
