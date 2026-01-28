
import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#050b18]">
      {/* Abstract Background Glows */}
      <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-transform group-hover:scale-110">
              <i className="fas fa-microchip text-white text-lg"></i>
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">Robo<span className="text-cyan-400">Scan</span></span>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">System Online</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { to: '/', label: 'Dashboard', icon: 'fa-layer-group' },
              { to: '/leaderboard', label: 'Rankings', icon: 'fa-trophy' },
              { to: '/settings', label: 'Control', icon: 'fa-sliders-h' }
            ].map(link => (
              <Link key={link.to} to={link.to} className="text-xs font-bold text-slate-400 hover:text-white flex items-center space-x-2 transition uppercase tracking-widest">
                <i className={`fas ${link.icon} text-sm`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
             <div className="hidden lg:flex items-center bg-black/40 border border-white/5 px-3 py-1.5 rounded-full">
                <i className="fas fa-cloud-upload-alt text-cyan-400 text-xs mr-2"></i>
                <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">Sync Active</span>
             </div>
             <Link to="/scan" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-cyan-500/20 active:scale-95 uppercase tracking-widest">
              New Run
             </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 relative z-10">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden glass-dark border-t border-white/10 fixed bottom-0 left-0 right-0 z-50 flex justify-around p-3 pb-6">
        <Link to="/" className="flex flex-col items-center text-slate-400 hover:text-cyan-400 transition">
          <i className="fas fa-th-large text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Home</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center -mt-10">
           <div className="w-16 h-16 rounded-full bg-gradient-to-t from-blue-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-90 transition-transform">
              <div className="w-full h-full rounded-full bg-[#050b18] flex items-center justify-center">
                 <i className="fas fa-qrcode text-2xl text-cyan-400"></i>
              </div>
           </div>
        </Link>
        <Link to="/leaderboard" className="flex flex-col items-center text-slate-400 hover:text-cyan-400 transition">
          <i className="fas fa-chart-bar text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Stats</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
