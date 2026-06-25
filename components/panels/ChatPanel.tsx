"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getMockAgentResponse } from "@/lib/agents/mockAgentResponses";
import type { Building, ChatMessage } from "@/lib/types/atlas";

interface ChatPanelProps {
  selectedBuilding?: Building | null;
}

const samplePrompts = [
  "What is happening in the village?",
  "Which building is blocked?",
  "What is our current AI spend?",
  "Summarize pending approvals.",
  "Suggest a new revenue experiment.",
  "What does Treasury recommend?",
];

export function ChatPanel({ selectedBuilding }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messageIdRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-001",
      role: "agent",
      content:
        "Atlas online. I can brief the village, inspect the selected building, explain Treasury, or summarize approvals. Mock mode only; no external action will execute.",
    },
  ]);

  const contextLabel = useMemo(
    () => selectedBuilding?.shortName ?? "Village",
    [selectedBuilding],
  );

  function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }

    messageIdRef.current += 1;
    const userMessageId = `m-user-${messageIdRef.current}`;
    messageIdRef.current += 1;
    const agentMessageId = `m-agent-${messageIdRef.current}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: trimmed,
    };
    const agentMessage: ChatMessage = {
      id: agentMessageId,
      role: "agent",
      content: getMockAgentResponse(trimmed, selectedBuilding),
    };

    setMessages((current) => [...current, userMessage, agentMessage]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(input);
  }

  return (
    <Card className="flex min-h-[340px] flex-col p-4">
      <CardHeader eyebrow="Right-Hand Man" title={`Chat · ${contextLabel}`} />
      <CardBody className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div
              className={
                message.role === "agent"
                  ? "rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] p-3"
                  : "rounded-lg border border-white/10 bg-white/[0.06] p-3"
              }
              key={message.id}
            >
              <div className="mb-1 text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                {message.role === "agent" ? "Atlas" : "You"}
              </div>
              <p className="text-xs leading-5 text-zinc-200">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {samplePrompts.slice(0, 3).map((prompt) => (
            <Button key={prompt} onClick={() => submitPrompt(prompt)} size="sm" variant="ghost">
              {prompt}
            </Button>
          ))}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
          <input
            className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Atlas..."
            value={input}
          />
          <Button aria-label="Send message" icon={<Send size={15} />} size="icon" type="submit" variant="primary" />
        </form>
      </CardBody>
    </Card>
  );
}
