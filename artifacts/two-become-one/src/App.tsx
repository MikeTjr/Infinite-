import React, { useState, useCallback } from 'react';
import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useCouple } from './hooks/useCouple';
import { SessionRecord, MirrorResults, JourneyState, Bond, CoupleProfile } from './lib/types';

import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Play from './pages/Play';
import Mirror from './pages/Mirror';
import Archive from './pages/Archive';
import Journey from './pages/Journey';
import Bonds from './pages/Bonds';
import Leaderboard from './pages/Leaderboard';
import TwoBecomOne from './pages/TwoBecomOne';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();

function AppRoutes() {
  const { state, setCouple, recordSession, driftCard, saveMirror, setJourney, addMoodToSession, createBond, joinBond } = useCouple();
  const [, navigate] = useLocation();

  const handleSetCouple = useCallback((couple: CoupleProfile) => {
    setCouple(couple);
  }, [setCouple]);

  const handleSessionComplete = useCallback((session: Omit<SessionRecord, 'scoreEarned'>) => {
    return recordSession(session);
  }, [recordSession]);

  const handleDrift = useCallback((cardId: string) => {
    driftCard(cardId);
  }, [driftCard]);

  const handleSaveMirror = useCallback((results: MirrorResults) => {
    saveMirror(results);
  }, [saveMirror]);

  const handleSetJourney = useCallback((j: JourneyState) => {
    setJourney(j);
  }, [setJourney]);

  const handleAddMood = useCallback((id: string, emoji: string, tag?: string) => {
    addMoodToSession(id, emoji, tag);
  }, [addMoodToSession]);

  const handleCreateBond = useCallback((name: string): Bond => {
    return createBond(name);
  }, [createBond]);

  const handleJoinBond = useCallback((code: string): Bond => {
    return joinBond(code);
  }, [joinBond]);

  return (
    <Switch>
      <Route path="/">
        <Landing state={state} />
      </Route>
      <Route path="/blend">
        <TwoBecomOne />
      </Route>
      <Route path="/setup">
        <Setup onComplete={handleSetCouple} />
      </Route>
      <Route path="/dashboard">
        {state.setupComplete ? (
          <Dashboard state={state} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/play">
        {state.setupComplete ? (
          <Play
            state={state}
            onSessionComplete={handleSessionComplete}
            onDrift={handleDrift}
            onAddMood={handleAddMood}
          />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/mirror">
        {state.setupComplete ? (
          <Mirror state={state} onSaveMirror={handleSaveMirror} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/archive">
        {state.setupComplete ? (
          <Archive state={state} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/journey">
        {state.setupComplete ? (
          <Journey state={state} onSetJourney={handleSetJourney} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/bonds">
        {state.setupComplete ? (
          <Bonds state={state} onCreateBond={handleCreateBond} onJoinBond={handleJoinBond} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route path="/leaderboard">
        {state.setupComplete ? (
          <Leaderboard state={state} />
        ) : (
          <Landing state={state} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
