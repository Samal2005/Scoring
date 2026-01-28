
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team, RaceSession } from '../types';

interface ScannerProps {
  teams: Team[];
  onAddSession: (session: RaceSession) => void;
}

const ScannerPage: React.FC<ScannerProps> = ({ teams, onAddSession }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setIsScanning(false);
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const handleManualSelect = (teamId: string) => {
    const newSession: RaceSession = {
      id: `session-${Date.now()}`,
      teamId,
      timestamp: Date.now(),
      timeouts: 0,
      obstacles: {},
      penalties: [],
      isCompleted: false,
      finalScore: 0
    };
    onAddSession(newSession);
    navigate(`/score/${newSession.id}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Identity <span className="text-cyan-400">Check</span></h1>
        <p className="text-slate-500 text-sm">Scan Unit QR or Select Manual Entry</p>
      </div>

      <div className="relative aspect-square glass-dark rounded-[2.5rem] overflow-hidden border-4 border-white/5">
        {isScanning ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-cyan-400/30 rounded-3xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1 rounded-br-xl"></div>
                <div className="absolute inset-0 bg-cyan-400 opacity-5 animate-pulse"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
             <i className="fas fa-video-slash text-5xl mb-4 opacity-20"></i>
             <p className="text-xs font-black uppercase tracking-widest">Camera Link Offline</p>
          </div>
        )}
      </div>

      <div className="glass-dark rounded-3xl p-6 border border-white/5 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Manual Registry</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => handleManualSelect(team.id)}
              className="w-full flex items-center justify-between p-4 glass hover:bg-white/[0.05] rounded-2xl transition group"
            >
              <div>
                <p className="font-bold text-white">#{team.number} - {team.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{team.school}</p>
              </div>
              <i className="fas fa-arrow-right text-slate-700 group-hover:text-cyan-400 transition"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
