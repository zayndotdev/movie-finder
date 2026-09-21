import * as React from 'react';
import { Sparkles, X, Send, Bot, User, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { useAIChatStore } from '../../stores/useAIChatStore';
import { UnifiedMediaItem } from '../../types';
import { buildImageUrl, formatYear } from '../../lib/utils';
import { RatingBadge } from '../content/RatingBadge';

export function AIChatPanel({
  onSelectMedia
}: {
  onSelectMedia: (item: UnifiedMediaItem) => void;
}) {
  const { messages, isOpen, isLoading, closeChat, sendMessage, clearChat } = useAIChatStore();
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!isLoading) {
      sendMessage(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeChat}
      />

      {/* Slide-in Panel */}
      <div className="relative z-50 flex h-full w-full max-w-lg flex-col bg-[#0C1220] border-l border-[#1E2A42] shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2A42] p-4 bg-[#111828]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#F8FAFC]">CineMatch AI Agent</h3>
              <p className="text-xs text-[#94A3B8]">Natural language mood & vibe discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              title="Clear Chat"
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E2A42] transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeChat}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E2A42] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                  : 'bg-[#111828] border border-[#1E2A42] text-[#F8FAFC] rounded-bl-none shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Render Media Cards if any */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1E2A42] flex flex-col gap-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Top Recommendations ({msg.recommendations.length})
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendations.map((item) => (
                        <div
                          key={`${item.mediaType}-${item.id}`}
                          onClick={() => {
                            onSelectMedia(item);
                            closeChat();
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl bg-[#0C1220] border border-[#1E2A42] hover:border-amber-500/40 hover:bg-[#172035] transition-all cursor-pointer group"
                        >
                          <img
                            src={buildImageUrl(item.posterPath, 'w185', 'poster')}
                            alt={item.title}
                            className="h-12 w-9 rounded-md object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-bold text-xs text-[#F8FAFC] group-hover:text-amber-400 transition-colors truncate">
                              {item.title}
                            </h6>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-[#64748B]">{formatYear(item.releaseDate)}</span>
                              <RatingBadge rating={item.voteAverage} showStar={false} className="py-0 px-1.5 text-[10px]" />
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-amber-400 group-hover:translate-x-1 transition-all mr-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-[#111828] p-3 rounded-2xl w-fit border border-[#1E2A42] animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing your mood and curating titles...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-[#1E2A42] bg-[#111828]/50 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            'Wholesome Bollywood romance',
            'Mind-bending sci-fi series with 8+ rating',
            'High-stakes psychological anime',
            'Lighthearted comedy for tonight'
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              className="whitespace-nowrap px-2.5 py-1 text-xs rounded-lg bg-[#0C1220] border border-[#1E2A42] text-[#94A3B8] hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#1E2A42] bg-[#0C1220]">
          <div className="flex items-center gap-2 rounded-xl border border-[#1E2A42] bg-[#111828] px-3 py-1.5 focus-within:border-amber-500/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your mood, actor, or era..."
              className="w-full bg-transparent py-1.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
