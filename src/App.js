import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppProvider } from './contexts/AppContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { StoriesProvider } from './contexts/StoriesContext';
import { MusicProvider } from './contexts/MusicContext';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="animate-pulse-slow text-2xl md:text-4xl text-white font-dancing">
          Loading Bedtime Stories...
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <SettingsProvider>
        <StoriesProvider>
          <MusicProvider>
            <Layout />
          </MusicProvider>
        </StoriesProvider>
      </SettingsProvider>
    </AppProvider>
  );
}

export default App; 