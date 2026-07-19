'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Brain, Lightbulb } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  'How is student attendance this week?',
  'Show me students at risk',
  'What is the fee collection forecast?',
  'Which classes are performing best?',
];

const aiResponses: Record<string, string> = {
  attendance: 'Based on this week\u2019s data, overall attendance is at 93.2%. Grade 8-A leads with 96%, while Grade 9-A is at 91% \u2014 a 2% drop from last week. Friday shows the lowest attendance consistently. Consider engagement activities for Friday afternoons.',
  risk: 'I\u2019ve identified 42 students at risk:\n\n\u2022 18 high-risk (attendance below 75% or failing grades)\n\u2022 24 medium-risk (declining performance trend)\n\nTop concerns:\n1. Aditya Verma (10-A) \u2014 2 consecutive failed Science tests\n2. Karthik Rao (9-A) \u2014 attendance at 71%\n3. Pooja Desai (8-B) \u2014 homework submission at 45%\n\nI recommend scheduling parent-teacher conferences for these students this week.',
  fee: 'Fee collection forecast for next month: \u20b9548,000 (91% confidence). This is a 2.4% increase from last month. Currently, 42 students have pending Q2 fees totaling \u20b91.5L. I recommend sending automated reminders to these families before the July 31 deadline.',
  performance: 'Top performing classes this term:\n\n1. Grade 8-A \u2014 88% avg, 96% attendance (+3.2% improvement)\n2. Grade 10-A \u2014 87% avg, 95% attendance (+2.8%)\n3. Grade 7-A \u2014 85% avg, 94% attendance (+1.5%)\n\nGrade 9-A needs attention in Mathematics (class avg 78%, down 4% from last term).',
  default: 'I can help you analyze student performance, attendance trends, fee collection, teacher effectiveness, and much more. Try asking about:\n\n\u2022 Student attendance or at-risk students\n\u2022 Fee collection forecasts\n\u2022 Class or teacher performance\n\u2022 Academic trends and recommendations',
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('attendance')) return aiResponses.attendance;
  if (q.includes('risk') || q.includes('at risk')) return aiResponses.risk;
  if (q.includes('fee') || q.includes('payment') || q.includes('revenue')) return aiResponses.fee;
  if (q.includes('perform') || q.includes('class') || q.includes('best')) return aiResponses.performance;
  return aiResponses.default;
}

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', content: 'Hello! I\u2019m Yovial AI, your school analytics assistant. I can help you understand trends, identify at-risk students, forecast revenue, and more. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = { id: Date.now() + 1, role: 'assistant', content: getResponse(text) };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-base">Yovial AI Assistant</SheetTitle>
              <p className="text-xs text-muted-foreground">Powered by your school data</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1" ref={scrollRef as never}>
          <div className="space-y-4 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-2.5', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-primary to-chart-2'
                      : 'bg-muted'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs font-semibold">You</span>
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line max-w-[80%]',
                    msg.role === 'assistant'
                      ? 'bg-muted/50'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground">Suggested questions:</p>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                  >
                    <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask anything about your school..."
              className="h-10 flex-1 rounded-lg border bg-muted/50 px-3 text-sm outline-none focus:border-primary focus:bg-background"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
