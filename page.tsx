
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Team, RaceSession, ScoringConfig } from './types';
import { DEFAULT_CONFIG, INITIAL_TEAMS } from './constants';
import Layout from './layout';

// Page Components
import DashboardPage from './dashboard/page';
import LeaderboardPage from './leaderboard/page';
import ScannerPage from './scan/page';
import ScoringPage from './scoring/page';
import SettingsPage from './settings/page';

const RootPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('robo_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [sessions, setSessions] = useState<RaceSession[]>(() => {
    const saved = localStorage.getItem('robo_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<ScoringConfig>(() => {
    const saved = localStorage.getItem('robo_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('robo_teams', JSON.stringify(teams));
    localStorage.setItem('robo_sessions', JSON.stringify(sessions));
    localStorage.setItem('robo_config', JSON.stringify(config));
  }, [teams, sessions, config]);

  const addSession = (session: RaceSession) => {
    setSessions(prev => [session, ...prev]);
  };

  const updateSession = (updated: RaceSession) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const resetAllData = () => {
    if (confirm('Execute System Purge? All records will be permanently erased.')) {
      setSessions([]);
      setTeams(INITIAL_TEAMS);
      setConfig(DEFAULT_CONFIG);
    }
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage teams={teams} sessions={sessions} />} />
          <Route path="/scan" element={<ScannerPage teams={teams} onAddSession={addSession} />} />
          <Route path="/score/:sessionId" element={<ScoringPage config={config} sessions={sessions} onUpdateSession={updateSession} teams={teams} />} />
          <Route path="/leaderboard" element={<LeaderboardPage teams={teams} sessions={sessions} config={config} />} />
          <Route path="/settings" element={<SettingsPage config={config} onUpdateConfig={setConfig} onReset={resetAllData} teams={teams} onUpdateTeams={setTeams} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default RootPage;
