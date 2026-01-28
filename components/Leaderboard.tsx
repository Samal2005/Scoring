
import React, { useState, useMemo } from 'react';
import { Team, RaceSession, ScoringConfig } from '../types';

interface LeaderboardProps {
  teams: Team[];
  sessions: RaceSession[];
  config: ScoringConfig;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ teams, sessions, config }) => {
  const [filter, setFilter] = useState('');

  const teamStats = useMemo(() => {
    return teams.map(team => {
      const teamSessions = sessions.filter(s => s.teamId === team.id && s.isCompleted);
      const bestSession = teamSessions.length > 0 
        ? teamSessions.reduce((best, current) => current.finalScore > best.finalScore ? current : best)
        : null;

      return {
        ...team,
        bestScore: bestSession?.finalScore || 0,
        bestTime: bestSession?.duration || 0,
        totalRuns: teamSessions.length
      };
    }).sort((a, b) => b.bestScore - a.bestScore || a.bestTime - b.bestTime);
  }, [teams, sessions]);

  const filteredStats = teamStats.filter(t => 
    t.name.toLowerCase().includes(filter.toLowerCase()) || 
    t.number.includes(filter)
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Hall of <span className="text-cyan-400 italic">Glory</span></h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Validated Unit Performance Rankings</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
           <div className="relative flex-grow">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="text" 
                placeholder="Search Unit..." 
                className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl w-full focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none text-white text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
           </div>
        </div>
      </header>

      <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Rank</th>
                <th className="px-8 py-6">Unit Profile</th>
                <th className="px-8 py-6">Best Run</th>
                <th className="px-8 py-6">Best Time</th>
                <th className="px-8 py-6 text-center">Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredStats.map((team, idx) => (
                <tr key={team.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-8 py-8">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      idx === 0 ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' :
                      idx === 1 ? 'bg-slate-500 text-white' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'text-slate-600 bg-white/5'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div>
                      <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">#{team.number}</span>
                      <h4 className="font-black text-white text-xl tracking-tighter">{team.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{team.school}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-3xl font-mono font-bold text-white neon-text">
                      {team.bestScore}
                    </span>
                    <span className="text-[8px] ml-2 font-black text-slate-600 uppercase tracking-widest">Points</span>
                  </td>
                  <td className="px-8 py-8">
                    <span className="font-mono text-slate-400 font-bold">
                      {team.bestTime > 0 ? `${(team.bestTime / 1000).toFixed(2)}s` : '--'}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {team.totalRuns} RUNS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStats.length === 0 && (
            <div className="p-20 text-center text-slate-600 font-black uppercase tracking-[0.5em] italic opacity-20">
              Registry Empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
