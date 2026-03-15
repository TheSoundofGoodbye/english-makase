import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';

function App() {
  const [hasHobby, setHasHobby] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    // Check if user has already set a hobby
    setHasHobby(!!StorageService.getHobby());
  }, []);

  if (hasHobby === null) {
    return null; // Loading state
  }

  return (
    <>
      {hasHobby && (
        <nav style={{ width: '100%', maxWidth: '800px', margin: '0 auto 2rem auto', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="btn-primary" 
            style={{ background: currentView === 'dashboard' ? 'var(--primary-gradient)' : 'var(--bg-secondary)', opacity: currentView === 'dashboard' ? 1 : 0.7 }}
          >
            대시보드
          </button>
          <button 
            onClick={() => setCurrentView('history')} 
            className="btn-primary"
            style={{ background: currentView === 'history' ? 'var(--primary-gradient)' : 'var(--bg-secondary)', opacity: currentView === 'history' ? 1 : 0.7 }}
          >
            학습 기록 보기
          </button>
        </nav>
      )}
      
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!hasHobby ? (
          <Onboarding onComplete={() => setHasHobby(true)} />
        ) : currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <History onBack={() => setCurrentView('dashboard')} />
        )}
      </main>
    </>
  );
}

export default App;
