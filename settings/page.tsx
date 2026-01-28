
import React, { useState } from 'react';
import { ScoringConfig, Team } from '../types';

interface SettingsProps {
  config: ScoringConfig;
  onUpdateConfig: (config: ScoringConfig) => void;
  onReset: () => void;
  teams: Team[];
  onUpdateTeams: (teams: Team[]) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ config, onUpdateConfig, onReset, teams, onUpdateTeams }) => {
  const [newTeam, setNewTeam] = useState({ number: '', name: '', school: '' });
  const inputClasses = "w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 transition text-white text-sm";

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Control <span className="text-cyan-400">Panel</span></h1>
        <p className="text-slate-500 text-sm">System parameters & Unit registry</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Algorithms</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={config.basePoints} onChange={(e) => onUpdateConfig({ ...config, basePoints: parseInt(e.target.value) || 0 })} className={inputClasses} placeholder="Base Points" />
              <input type="number" value={config.timeoutDeduction} onChange={(e) => onUpdateConfig({ ...config, timeoutDeduction: parseInt(e.target.value) || 0 })} className={inputClasses} placeholder="Timeout DED" />
            </div>
          </div>
          <button onClick={onReset} className="w-full py-4 border border-red-500/30 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition">Execute Purge</button>
        </section>

        <section className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Unit Registry</h3>
           <div className="space-y-3">
             <div className="grid grid-cols-3 gap-2">
               <input placeholder="No." className={inputClasses} value={newTeam.number} onChange={e => setNewTeam({...newTeam, number: e.target.value})} />
               <input placeholder="Name" className={`col-span-2 ${inputClasses}`} value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
             </div>
             <button onClick={() => { if(newTeam.name) onUpdateTeams([...teams, { id: `team-${Date.now()}`, ...newTeam }]); setNewTeam({ number: '', name: '', school: '' }); }} className="w-full bg-cyan-500 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest">Register Unit</button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
