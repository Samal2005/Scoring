
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team, RaceSession, ObstacleStatus } from '../types';

interface ScannerProps {
  teams: Team[];
  onAddSession: (session: RaceSession) => void;
}

const Scanner: React.FC<ScannerProps> = ({ teams, onAddSession }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or unavailable. Use manual selection below.");
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
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
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Identity Check</h1>
        <p className="text-slate-500">Scan Team QR or Select Manually</p>
      </div>

      <div className="relative aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200">
        {isScanning ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-blue-400 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg"></div>
                <div className="absolute inset-0 bg-blue-400 opacity-10 animate-pulse"></div>
              </div>
            </div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-bold bg-black/50 py-2">
              Align QR code within the frame
            </p>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white bg-slate-800">
             <i className="fas fa-camera-slash text-4xl mb-4 text-slate-500"></i>
             <p className="font-medium">{error || "Camera disabled"}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4 flex items-center">
          <i className="fas fa-list-ul mr-2 text-blue-600"></i> Manual Team Selection
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => handleManualSelect(team.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition text-left group"
            >
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-700">#{team.number} - {team.name}</p>
                <p className="text-xs text-slate-500">{team.school}</p>
              </div>
              <i className="fas fa-plus text-slate-300 group-hover:text-blue-500"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
