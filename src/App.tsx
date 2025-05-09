import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Client } from 'boardgame.io/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainMenu, WizardDuelBoard } from './components/board';
import { WizardDuel } from './core/game';

const WizardDuelClient = Client({
  game: WizardDuel,
  board: WizardDuelBoard,
  debug: { collapseOnLoad: true, hideToggleButton: true }, // Set to false for enabling debug panel
});

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainMenu />} />
          <Route path='/game' element={<WizardDuelClient />} />
        </Routes>
      </BrowserRouter>

      {/* Provides website performance metrics */}
      <SpeedInsights />
      {/* Count visitors and page views */}
      <Analytics />
    </>
  );
};
