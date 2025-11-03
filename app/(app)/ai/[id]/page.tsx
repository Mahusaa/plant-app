"use client";

import { useState } from "react";
import Link from "next/link";
import { healthAdviceAction } from "@/actions/health";
import { useStreamableValue } from "@ai-sdk/rsc";
import type { StreamableValue } from "@ai-sdk/rsc";

function Streamed({ data }: { data: StreamableValue<string> }) {
  const [streamedText] = useStreamableValue<string>(data);
  return <div className="p-2 rounded-md bg-secondary whitespace-pre-wrap text-sm">{streamedText ?? ""}</div>;
}

export default function AIPlantPage() {
  const [prompt, setPrompt] = useState("");
  const [items, setItems] = useState<{ you: string; ai?: StreamableValue<string> }[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask() {
    const p = prompt.trim();
    if (!p) return;
    setPrompt("");
    setItems((m) => [{ you: p }, ...m]);
    setLoading(true);
    try {
      const res = await healthAdviceAction({ prompt: p });
      setItems((m) => [{ you: p, ai: res.output }, ...m.slice(1)]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/ai" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">←</Link>
        <h1 className="text-xl font-semibold">Daisy • AI</h1>
      </div>

      <div className="rounded-xl border p-4 bg-card space-y-2 shadow-sm">
        <div className="text-sm text-muted-foreground">AI Output</div>
        <div className="space-y-2">
          {items.map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="text-sm"><span className="text-muted-foreground">You:</span> {m.you}</div>
              {m.ai ? <Streamed data={m.ai} /> : null}
            </div>
          ))}
          {loading && <div className="text-sm text-muted-foreground">Thinking...</div>}
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

