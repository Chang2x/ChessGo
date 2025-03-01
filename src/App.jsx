// Force Vercel Update - Chess Game App
import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import DifficultySelect from './components/DifficultySelect'
import ColorSelect from './components/ColorSelect'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [gameSettings, setGameSettings] = useState({
    difficulty: null,
    playerColor: 'w'
  });

  const handleSplashFinish = () => {
    setCurrentScreen('landing');
  };

  const handleStartPlaying = () => {
    setCurrentScreen('difficulty');
  };

  const handleDifficultySelect = (difficulty) => {
    setGameSettings({ ...gameSettings, difficulty });
    setCurrentScreen('color');
  };

  const handleColorSelect = (color) => {
    setGameSettings({ ...gameSettings, playerColor: color });
    setCurrentScreen('game');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'difficulty':
        setCurrentScreen('landing');
        break;
      case 'color':
        setCurrentScreen('difficulty');
        break;
      case 'game':
        setCurrentScreen('color');
        break;
      default:
        setCurrentScreen('landing');
    }
  };

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} />;

    case 'difficulty':
      return <DifficultySelect onSelect={handleDifficultySelect} onBack={handleBack} />;

    case 'color':
      return <ColorSelect onSelect={handleColorSelect} onBack={handleBack} />;

    case 'game':
      return <GameBoard 
        difficulty={gameSettings.difficulty} 
        playerColor={gameSettings.playerColor}
        onBack={handleBack} 
      />;

    default:
      return (
        <div className="landing-container">
          <div className="landing-page">
            <div className="hero-section">
              <div className="logo">
                <div className="logo-piece">♔</div>
              </div>
              <h1>ChessGo</h1>
              <p className="tagline">Elevate Your Chess Game</p>
            </div>

            <div className="features-section">
              <div className="feature-card">
                <span className="feature-icon">♟</span>
                <h3>Learn</h3>
                <p>Interactive chess lessons</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">♜</span>
                <h3>Practice</h3>
                <p>Train with smart AI</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">♝</span>
                <h3>Analyze</h3>
                <p>Review your games</p>
              </div>
            </div>

            <div className="cta-section">
              <button className="start-button" onClick={handleStartPlaying}>
                Start Playing
              </button>
              <p className="cta-text">No account needed • Play offline • Free forever</p>
            </div>

            <div className="background-pattern"></div>
          </div>
        </div>
      );
  }
}

export default App;
