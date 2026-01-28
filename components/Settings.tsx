
import React, { useState } from 'react';
import { ScoringConfig, Team } from '../types';

interface SettingsProps {
  config: ScoringConfig;
  onUpdateConfig: (config: ScoringConfig) => void;
  onReset: () => void;
  teams: Team[];
  onUpdateTeams: (teams: Team[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig, onReset, teams, onUpdateTeams }) => {
  const [newTeam, setNewTeam] = useState({ number: '', name: '', school: '' });

  const inputClasses = "w-full p-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-white font-medium placeholder:text-slate-600 text-sm";
  const numberInputClasses = `${inputClasses} font-mono font-bold text-xl text-cyan-400`;

  const addTeam = () => {
    if (!newTeam.number || !newTeam.name) return;
    const team: Team = {
      id: `team-${Date.now()}`,
      ...newTeam
    };
    onUpdateTeams([...teams, team]);
    setNewTeam({ number: '', name: '', school: '' });
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Control <span className="text-cyan-400">Panel</span></h1>
        <p className="text-slate-500 text-sm font-medium">System parameters and security clearing</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-8">
          {/* Rules */}
          <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center">
              <i className="fas fa-sliders-h mr-3 text-cyan-400"></i>
              Score Algorithms
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Base Points</label>
                <input 
                  type="number" 
                  value={config.basePoints}
                  onChange={(e) => onUpdateConfig({ ...config, basePoints: parseInt(e.target.value) || 0 })}
                  className={numberInputClasses}
                />
              </div>
              <div>
                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Timeout Penalty</label>
                <input 
                  type="number" 
                  value={config.timeoutDeduction}
                  onChange={(e) => onUpdateConfig({ ...config, timeoutDeduction: parseInt(e.target.value) || 0 })}
                  className={numberInputClasses}
                />
              </div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-red-500/10 space-y-4">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-[0.4em]">Danger Zone</h3>
            <button 
              onClick={onReset}
              className="w-full bg-red-600/10 border border-red-600/30 text-red-500 hover:bg-red-600/20 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Execute System Purge
            </button>
          </div>
        </section>

        {/* Team Roster */}
        <section className="glass-dark p-8 rounded-3xl border border-white/5 space-y-8">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center">
            <i className="fas fa-users-cog mr-3 text-cyan-400"></i>
            Unit Registry
          </h3>

          <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4">
             <div className="grid grid-cols-3 gap-3">
               <input placeholder="No." className={inputClasses} value={newTeam.number} onChange={e => setNewTeam({...newTeam, number: e.target.value})} />
               <input placeholder="Unit Name" className={`col-span-2 ${inputClasses}`} value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
             </div>
             <input placeholder="Organization / School" className={inputClasses} value={newTeam.school} onChange={e => setNewTeam({...newTeam, school: e.target.value})} />
             <button onClick={addTeam} className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
               Register Unit
             </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {teams.map(team => (
              <div key={team.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black text-[10px]">
                    #{team.number}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-none mb-1">{team.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{team.school}</p>
                  </div>
                </div>
                <button onClick={() => onUpdateTeams(teams.filter(t => t.id !== team.id))} className="text-slate-700 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
