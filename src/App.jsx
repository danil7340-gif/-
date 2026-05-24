import React, { useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import EventModal from './components/EventModal';
import DiplomacyModal from './components/DiplomacyModal';
import { useGameState } from './hooks/useGameState';
import { Globe, Shield, Activity, BarChart3 } from 'lucide-react';

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
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start">
          <div className="flex space-x-4">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl pointer-events-auto">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Globe className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">Global Stability</p>
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Activity className="text-red-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">World Tension</p>
                    <span className="text-red-400 font-black text-lg">24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl pointer-events-auto">
             <div className="flex items-center space-x-4">
                <BarChart3 className="text-emerald-400" size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Era: <span className="text-white">Modern Age</span></span>
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
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md px-8 py-3 rounded-full border border-red-400/50 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-bounce">
            <p className="text-white font-black uppercase tracking-tighter flex items-center">
              <Sword className="mr-3" size={20} />
              Invasion Mode: Select Target Territory
            </p>
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

export default App;
