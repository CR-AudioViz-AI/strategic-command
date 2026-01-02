'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with canvas
const StrategicCommandGame = dynamic(
  () => import('@/components/Game'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-game-darker flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⚔️</div>
          <h1 className="text-2xl font-bold text-amber-400 mb-2">Strategic Command</h1>
          <p className="text-slate-400">Loading game...</p>
          <div className="mt-4 w-48 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  return <StrategicCommandGame />;
}
