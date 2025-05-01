import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { WizardDuel } from './core/game/game';
import MainMenu from './components/board/MainMenu';
import WizardDuelBoard from './components/board/WizardDuelBoard';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const WizardDuelClient = Client({
  game: WizardDuel,
  board: WizardDuelBoard,
  // Set to false for enabling debug panel
  debug: { collapseOnLoad: true, hideToggleButton: true },
});

const App = () => {
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

export default App;
