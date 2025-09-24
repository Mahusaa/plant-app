"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIPlantPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function ask() {
    if (!prompt.trim()) return;
    setMessages((m) => [
      ...m,
      `You: ${prompt}`,
      "AI: Based on current metrics, water today and move to indirect light.",
    ]);
    setPrompt("");
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/ai" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">←</Link>
        <h1 className="text-xl font-semibold">Daisy • AI</h1>
      </div>

      <div className="rounded-xl border p-4 bg-card space-y-2 shadow-sm">
        <div className="text-sm text-muted-foreground">AI Output</div>
        <div className="space-y-2 text-sm">
          {messages.map((m, i) => (
            <div key={i} className="p-2 rounded-md bg-secondary">{m}</div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask for care tips..."
          className="flex-1 h-11 rounded-md border px-3 bg-background"
        />
        <button onClick={ask} className="h-11 px-4 rounded-md bg-primary text-primary-foreground">Send</button>
      </div>

      <div className="rounded-xl border p-4 bg-card shadow-sm">
        <div className="text-sm text-muted-foreground">Recommendations & Warnings</div>
        <ul className="mt-2 text-sm list-disc pl-4">
          <li>Water today; soil moisture below threshold.</li>
          <li>Place near window with sheer curtain for optimal light.</li>
        </ul>
      </div>
    </main>
  );
}


