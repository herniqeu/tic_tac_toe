'use client';

import dynamic from 'next/dynamic';

const TicTacToe = dynamic(() => import('@/components/TicTacToe'), {
  ssr: false
});

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <TicTacToe />
    </main>
  );
}