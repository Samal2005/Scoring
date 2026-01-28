
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RaceSession, ScoringConfig, Team, ObstacleStatus } from '../types';

interface ScoringViewProps {
  config: ScoringConfig;
  sessions: RaceSession[];
  teams: Team[];
  onUpdateSession: (session: RaceSession) => void;
}

const ScoringView: React.FC<ScoringViewProps> = ({ config, sessions, teams, onUpdateSession }) => {
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
    if (session?.isCompleted) {
        setTimer(session.duration || 0);
    }
  }, [session]);

  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - timer;
      intervalRef.current = window.setInterval(() => {
        setTimer(Date.now() - start);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  if (!session || !team) return <div>Session not found</div>;

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
    const updated = {
      ...session,
      obstacles: { ...session.obstacles, [obsId]: status }
    };
    updated.finalScore = calculateScore(updated);
    onUpdateSession(updated);
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const msStr = (ms % 1000).toString().padStart(3, '0').slice(0, 2);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}.${msStr}`;
  };

  const handleLongPressStart = () => {
    if (isRunning) return;
    setSubmitProgress(0);
    pressTimerRef.current = window.setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 100) {
          clearInterval(pressTimerRef.current!);
          finalizeRun();
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const handleLongPressEnd = () => {
    if (pressTimerRef.current) clearInterval(pressTimerRef.current);
    if (submitProgress < 100) setSubmitProgress(0);
  };

  const finalizeRun = () => {
    const updated = {
      ...session,
      duration: timer,
      isCompleted: true,
      endTime: Date.now(),
      finalScore: calculateScore({ ...session, duration: timer })
    };
    onUpdateSession(updated);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar Info (Reference Style) */}
      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">
        <span>3:38 PM IST, WED, JAN 28, 2026</span>
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2">
              <i className="fas fa-battery-three-quarters"></i>
              <span>85%</span>
           </div>
           <div className="flex items-center space-x-2 text-green-400">
              <i className="fas fa-cloud"></i>
              <span>Sync Complete</span>
           </div>
        </div>
      </div>

      {/* Team Profile Glass Panel */}
      <div className="glass-dark rounded-3xl p-6 border border-white/5 flex items-center space-x-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl -mr-10 -mt-10"></div>
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center relative group-hover:neon-border transition-all">
          <i className="fas fa-qrcode text-3xl text-cyan-400"></i>
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-3 mb-1">
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Team {team.number}</h2>
             <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] font-black border border-green-500/20 tracking-widest uppercase">Verified</span>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">{team.name}</p>
        </div>
      </div>

      {/* Scoring Table */}
      <div className="glass-dark rounded-3xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-3 bg-white/5 border-b border-white/5 px-6 py-3">
          {['Autonomous', 'Tele-Op', 'Endgame'].map(cat => (
            <span key={cat} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{cat}</span>
          ))}
        </div>
        <div className="divide-y divide-white/5">
          {config.obstacles.map((obs) => (
            <div key={obs.id} className="grid grid-cols-12 items-center px-6 py-5 hover:bg-white/[0.02] transition">
              <div className="col-span-6 flex items-center space-x-3">
                <span className="text-sm font-bold text-slate-200">{obs.name}</span>
              </div>
              <div className="col-span-2 text-center">
                 <span className="font-mono text-xl font-bold text-cyan-400 neon-text">{obs.maxPoints}</span>
              </div>
              <div className="col-span-4 flex justify-end space-x-3">
                 {[ObstacleStatus.FAILED, ObstacleStatus.PARTIAL, ObstacleStatus.CLEARED].map((status, i) => (
                   <button
                     key={status}
                     disabled={session.isCompleted}
                     onClick={() => updateObstacle(obs.id, status)}
                     className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                       ${session.obstacles[obs.id] === status 
                         ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                         : 'border-white/10 text-slate-600 hover:border-white/30'}`}
                   >
                     {i === 0 && <i className="fas fa-times text-xs"></i>}
                     {i === 1 && <span className="text-[10px] font-black">1/2</span>}
                     {i === 2 && <i className="fas fa-check text-xs"></i>}
                   </button>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Score Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Live Score Glass */}
        <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-center">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Score Output</div>
           <div className="text-5xl font-black text-white neon-text tracking-tighter">
             {calculateScore(session)} <span className="text-cyan-500 text-lg uppercase tracking-tighter ml-2">PTS</span>
           </div>
           <div className="absolute top-0 right-0 h-full w-24 bg-cyan-500/5 blur-3xl"></div>
        </div>

        {/* Timer Panel */}
        <div className="glass-dark rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center">
           <div className="font-mono text-4xl font-bold text-white mb-6 tracking-tight">
             {formatTime(timer)}
           </div>
           <div className="flex space-x-4">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                disabled={session.isCompleted}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all 
                  ${isRunning 
                    ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'bg-green-500/20 border-2 border-green-500/50 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'}`}
              >
                <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button 
                onClick={() => setTimer(0)}
                disabled={isRunning || session.isCompleted}
                className="w-14 h-14 rounded-full bg-white/5 border-2 border-white/10 text-slate-400 flex items-center justify-center hover:bg-white/10 transition"
              >
                <i className="fas fa-undo"></i>
              </button>
           </div>
        </div>
      </div>

      {/* Penalty/Timeout Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
         <button 
           onClick={() => {
              const updated = { ...session, timeouts: session.timeouts + 1 };
              updated.finalScore = calculateScore(updated);
              onUpdateSession(updated);
           }}
           disabled={session.isCompleted}
           className="glass py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase border-orange-500/10 hover:border-orange-500/40 transition"
         >
           Call Timeout ({session.timeouts})
         </button>
         <button 
           onClick={() => {
              const pId = config.penalties[0].id; // Standard foul
              const updated = { ...session, penalties: [...session.penalties, pId] };
              updated.finalScore = calculateScore(updated);
              onUpdateSession(updated);
           }}
           disabled={session.isCompleted}
           className="glass py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] text-red-400 uppercase border-red-500/10 hover:border-red-500/40 transition"
         >
           Add Foul ({session.penalties.length})
         </button>
      </div>

      {/* Submit Pill Button (Long Press Style) */}
      {!session.isCompleted && (
        <div className="pt-6">
          <button
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            disabled={isRunning}
            className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] relative overflow-hidden transition-all
              ${isRunning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95'}`}
          >
            {/* Progress Overlay */}
            <div 
              className="absolute inset-0 bg-blue-400 transition-all duration-75 pointer-events-none opacity-40" 
              style={{ width: `${submitProgress}%` }}
            ></div>
            
            <div className="relative z-10 flex items-center justify-center space-x-3">
              <span>{isRunning ? 'Stop Timer to Submit' : 'Hold to Complete Run'}</span>
              {!isRunning && <i className="fas fa-chevron-right ml-2 animate-pulse"></i>}
            </div>
          </button>
        </div>
      )}

      {/* Footer Meta */}
      <div className="flex justify-center items-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4">
         <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
         <span>Online - Secure Node Session</span>
      </div>
    </div>
  );
};

export default ScoringView;
