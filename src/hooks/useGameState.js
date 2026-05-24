import { useState, useCallback } from 'react';
import axios from 'axios';

const INITIAL_GOLD = 1000;
const INITIAL_TURN = 1;

export const UNIT_TYPES = {
  INFANTRY: { name: 'Infantry', cost: 50, power: 1 },
  TANKS: { name: 'Tanks', cost: 150, power: 4 },
  AIR_FORCE: { name: 'Air Force', cost: 300, power: 10 }
};

export const useGameState = () => {
  const [gold, setGold] = useState(INITIAL_GOLD);
  const [turn, setTurn] = useState(INITIAL_TURN);
  const [provinces, setProvinces] = useState({});
  const [playerNation, setPlayerNation] = useState('Player');
  const [history, setHistory] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  const updateProvince = useCallback((id, updates) => {
    setProvinces(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  }, []);

  const addHistory = useCallback((msg) => {
    setHistory(prev => [msg, ...prev].slice(0, 50));
  }, []);

  const recruit = useCallback((provinceId, unitType) => {
    const unit = UNIT_TYPES[unitType];
    if (gold >= unit.cost) {
      setGold(prev => prev - unit.cost);
      updateProvince(provinceId, {
        troops: (provinces[provinceId]?.troops || 0) + unit.power
      });
      addHistory(`Recruited ${unit.name} in ${provinces[provinceId]?.name || provinceId}`);
      return true;
    }
    return false;
  }, [gold, provinces, addHistory, updateProvince]);

  const attack = useCallback((fromId, toId) => {
    const attacker = provinces[fromId];
    const defender = provinces[toId];
    if (!attacker || !defender || attacker.troops <= 1) return;

    const attackingForce = attacker.troops - 1;
    const defendingForce = defender.troops;
    const attackRoll = attackingForce * (0.5 + Math.random());
    const defendRoll = defendingForce * (0.8 + Math.random());

    if (attackRoll > defendRoll) {
      const remainingAttacker = Math.max(1, Math.floor(attackingForce - defendingForce * 0.5));
      updateProvince(fromId, { troops: 1 });
      updateProvince(toId, { owner: attacker.owner, troops: remainingAttacker });
      addHistory(`Victory! ${attacker.name} captured ${defender.name}`);
    } else {
      const remainingAttacker = Math.max(1, Math.floor(attackingForce * 0.2));
      const remainingDefender = Math.max(1, Math.floor(defendingForce - attackingForce * 0.3));
      updateProvince(fromId, { troops: remainingAttacker });
      updateProvince(toId, { troops: remainingDefender });
      addHistory(`Defeat! Attack on ${defender.name} failed`);
    }
  }, [provinces, updateProvince, addHistory]);

  const triggerEvent = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/event', {
        gameState: { gold, turn, provincesCount: Object.keys(provinces).length }
      });
      setActiveEvent(response.data);
    } catch (e) {
      console.error("AI Event failed", e);
    }
  };

  const nextTurn = useCallback(() => {
    const newTurn = turn + 1;
    setTurn(newTurn);
    let totalIncome = 0;
    Object.values(provinces).forEach(p => {
      if (p.owner === playerNation) totalIncome += p.income || 5;
    });
    setGold(g => g + totalIncome);
    addHistory(`Turn ${newTurn} started. Income: +${totalIncome} gold.`);

    // Trigger AI event every 5 turns
    if (newTurn % 5 === 0) {
      triggerEvent();
    }
  }, [provinces, playerNation, turn, gold, addHistory]);

  const handleEventChoice = (choice) => {
    setGold(g => g + (choice.consequence.gold || 0));
    addHistory(`Event: ${choice.consequence.message}`);
    setActiveEvent(null);
  };

  return {
    gold, turn, provinces, playerNation, history, activeEvent,
    updateProvince, recruit, attack, nextTurn, handleEventChoice, setProvinces
  };
};
