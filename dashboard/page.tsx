
import React from 'react';
import { Link } from 'react-router-dom';
import { Team, RaceSession } from '../types';

interface DashboardProps {
  teams: Team[];
  sessions: RaceSession[];
}

const DashboardPage: React.FC<DashboardProps> = ({ teams, sessions }) => {
  const completedSessions = sessions.filter(s => s.isCompleted);
  const activeSessions = sessions.filter(s => !s.isCompleted);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Command <span className="text-cyan-400 italic">Deck</span></h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Autonomous Monitoring & Live Scoring Engine</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Units', value: teams.length, color: 'text-white' },
          { label: 'Finalized', value: completedSessions.length, color: 'text-white' },
          { label: 'In Mission', value: activeSessions.length, color: 'text-cyan-400' },
          { label: 'Top Record', value: completedSessions.length > 0 ? `${(Math.min(...completedSessions.map(s => s.duration || 999999)) / 1000).toFixed(2)}s` : 'N/A', color: 'text-white' }
        ].map((stat, i) => (
          <div key={i} className="glass-dark p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/[0.02] rounded-full group-hover:bg-cyan-500/[0.05] transition-all"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3 shadow-[0_0_8px_cyan]"></span>
              Live Feed
            </h2>
          </div>
          <div className="space-y-3">
            {activeSessions.length === 0 ? (
              <div className="glass-dark border-2 border-dashed border-white/5 rounded-3xl p-12 text-center text-slate-600">
                <i className="fas fa-radar text-4xl mb-4 opacity-20"></i>
                <p className="text-xs font-bold uppercase tracking-widest italic">No Active Transmissions</p>
              </div>
            ) : (
              activeSessions.map(session => {
                const team = teams.find(t => t.id === session.teamId);
                return (
                  <Link key={session.id} to={`/score/${session.id}`} className="block glass-dark hover:bg-white/[0.05] p-5 rounded-2xl border border-white/5 transition-all group active:scale-[0.98]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:neon-border transition">
                          <i className="fas fa-microchip"></i>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">UNIT #{team?.number}</span>
                          <h4 className="font-bold text-white text-lg tracking-tight">{team?.name}</h4>
                        </div>
                      </div>
                      <i className="fas fa-arrow-right text-slate-700 group-hover:text-cyan-400 transition transform group-hover:translate-x-1"></i>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Archive</h2>
          <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              {completedSessions.length === 0 ? (
                <div className="p-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest italic">Logs Empty</div>
              ) : (
                completedSessions.slice(0, 5).map(session => {
                  const team = teams.find(t => t.id === session.teamId);
                  return (
                    <div key={session.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                          <i className="fas fa-file-invoice text-sm"></i>
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm tracking-tight">{team?.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{(session.duration || 0) / 1000}s • {session.penalties.length} Pen</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-cyan-400 text-lg neon-text">{session.finalScore}</p>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">{new Date(session.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
