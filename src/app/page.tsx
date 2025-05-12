import { AgentInteraction } from '@/components/agent-interaction';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-3xl mt-4 mb-6 text-center">
        <div className="text-right mb-4">
          <Link href="/config" className="text-sm text-primary hover:underline">API Configuration</Link>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          AgentFlow
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Your AI-powered assistant for HR, workforce, summaries, spreadsheets, and more.
        </p>
      </header>
      <main className="w-full max-w-3xl flex-grow">
        <AgentInteraction />
      </main>
      <footer className="w-full max-w-3xl mt-8 mb-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by Next.js & Genkit
        </p>
      </footer>
    </div>
  );
}
