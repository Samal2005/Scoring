
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RaceSession, ScoringConfig, Team, ObstacleStatus } from '../types';

interface ScoringViewProps {
  config: ScoringConfig;
  sessions: RaceSession[];
  teams: Team[];
  onUpdateSession: (session: RaceSession) => void;
}

const ScoringPage: React.FC<ScoringViewProps> = ({ config, sessions, teams, onUpdateSession }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const session = sessions.find(s => s.id === sessionId);
  const team = teams.find(t => t.id === session?.teamId);

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const pressTimerRef = useRef<number | null>(null);
  const [submitProgress, setSubmitProgress] = useState(0);

  useEffect(() => {
    if (session?.isCompleted) setTimer(session.duration || 0);
  }, [session]);

  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - timer;
      intervalRef.current = window.setInterval(() => setTimer(Date.now() - start), 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  if (!session || !team) return <div>Session Data Missing</div>;

  const calculateScore = (currentSession: RaceSession): number => {
    let score = config.basePoints;
    config.obstacles.forEach(obs => {
      const status = currentSession.obstacles[obs.id];
      if (status === ObstacleStatus.CLEARED) score += obs.maxPoints;
      else if (status === ObstacleStatus.PARTIAL) score += Math.floor(obs.maxPoints / 2);
    });
    currentSession.penalties.forEach(pId => {
      const p = config.penalties.find(x => x.id === pId);
      if (p) score -= p.points;
    });
    score -= (currentSession.timeouts * config.timeoutDeduction);
    return Math.max(0, score);
  };

  const updateObstacle = (obsId: string, status: ObstacleStatus) => {
    if (session.isCompleted) return;
    const updated = { ...session, obstacles: { ...session.obstacles, [obsId]: status } };
    updated.finalScore = calculateScore(updated);
    onUpdateSession(updated);
  };

  const handlePhotoUpload = (field: 'teamPhoto' | 'robotPhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateSession({ ...session, [field]: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLongPressStart = () => {
    if (isRunning) return;
    setSubmitProgress(0);
    pressTimerRef.current = window.setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 100) {
          clearInterval(pressTimerRef.current!);
          const final = { ...session, duration: timer, isCompleted: true, endTime: Date.now(), finalScore: calculateScore({ ...session, duration: timer }) };
          onUpdateSession(final);
          navigate('/');
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Top Meta */}
      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">
        <span>Scoring Link Established</span>
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2 text-green-400">
              <i className="fas fa-check-circle"></i>
              <span>Live Sync</span>
           </div>
        </div>
      </div>

      {/* Team Profile */}
      <div className="glass-dark rounded-[2rem] p-6 border border-white/5 flex items-center space-x-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <i className="fas fa-robot text-2xl text-cyan-400"></i>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Unit #{team.number}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{team.name}</p>
        </div>
      </div>

      {/* Visual Documentation Section */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Team Photo', field: 'teamPhoto' as const, icon: 'fa-users' },
          { label: 'Robot Photo', field: 'robotPhoto' as const, icon: 'fa-cog' }
        ].map((item) => (
          <div key={item.field} className="glass-dark p-4 rounded-3xl border border-white/5 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={(e) => handlePhotoUpload(item.field, e)}
                  disabled={session.isCompleted}
                />
                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all ${!session.isCompleted ? 'hover:bg-cyan-500/20 hover:text-cyan-400' : 'opacity-20'}`}>
                  <i className="fas fa-camera text-xs"></i>
                </div>
              </label>
            </div>
            
            <div className="aspect-video rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
              {session[item.field] ? (
                <img src={session[item.field]} className="w-full h-full object-cover" alt={item.label} />
              ) : (
                <div className="flex flex-col items-center opacity-10">
                  <i className={`fas ${item.icon} text-2xl mb-1`}></i>
                  <span className="text-[8px] font-black uppercase tracking-tighter">No Media</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Grid */}
      <div className="glass-dark rounded-3xl overflow-hidden border border-white/5 divide-y divide-white/5">
        {config.obstacles.map((obs) => (
          <div key={obs.id} className="grid grid-cols-12 items-center px-6 py-5">
            <div className="col-span-6"><span className="text-sm font-bold text-slate-200">{obs.name}</span></div>
            <div className="col-span-2 text-center font-mono font-bold text-cyan-400 text-xl">{obs.maxPoints}</div>
            <div className="col-span-4 flex justify-end space-x-2">
               {[ObstacleStatus.FAILED, ObstacleStatus.PARTIAL, ObstacleStatus.CLEARED].map((status, i) => (
                 <button
                   key={status}
                   onClick={() => updateObstacle(obs.id, status)}
                   className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                     ${session.obstacles[obs.id] === status ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_10px_cyan]' : 'border-white/10 text-slate-700'}`}
                 >
                   <i className={`fas ${i === 0 ? 'fa-times' : i === 1 ? 'fa-minus' : 'fa-check'} text-[10px]`}></i>
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 border border-white/10">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Telemetry</div>
           <div className="text-5xl font-black text-white neon-text tracking-tighter">{calculateScore(session)} <span className="text-cyan-500 text-sm">PTS</span></div>
        </div>
        <div className="glass-dark rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center">
           <div className="font-mono text-4xl font-bold text-white mb-6 tracking-tight">
             {Math.floor(timer / 1000)}s.{(timer % 1000).toString().padStart(3, '0').slice(0, 2)}
           </div>
           <div className="flex space-x-4">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-14 h-14 rounded-full flex items-center justify-center ${isRunning ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
           </div>
        </div>
      </div>

      {!session.isCompleted && (
        <button
          onMouseDown={handleLongPressStart}
          onMouseUp={() => { clearInterval(pressTimerRef.current!); setSubmitProgress(0); }}
          className="w-full py-5 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-[0.4em] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-400 opacity-40 transition-all" style={{ width: `${submitProgress}%` }}></div>
          <span className="relative z-10">Hold to Finalize Session</span>
        </button>
      )}
    </div>
  );
};

export default ScoringPage;
