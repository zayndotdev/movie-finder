import { create } from 'zustand';
import { UnifiedMediaItem } from '../types';
import { sendAIChatMessage } from '../services/api';
import { useAdultStore } from './useAdultStore';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  recommendations?: UnifiedMediaItem[];
  timestamp: number;
}

interface AIChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  sender: 'agent',
  text: "Hello! I'm CineMatch AI. Tell me what mood or vibe you're feeling, or ask for something specific like 'a wholesome 8+ rated Bollywood movie' or 'a dark Japanese thriller series'. What would you like to watch?",
  timestamp: Date.now()
};

export const useAIChatStore = create<AIChatState>((set, get) => ({
  messages: [INITIAL_GREETING],
  isOpen: false,
  isLoading: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set(state => ({ isOpen: !state.isOpen })),

  sendMessage: async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: Date.now()
    };

    set(state => ({
      messages: [...state.messages, userMessage],
      isLoading: true
    }));

    try {
      const adultMode = useAdultStore.getState().adultMode;
      const res = await sendAIChatMessage(query.trim(), adultMode);

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.data.reply,
        recommendations: res.data.recommendations,
        timestamp: Date.now()
      };

      set(state => ({
        messages: [...state.messages, agentMessage],
        isLoading: false
      }));
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMessage: ChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        text: 'I ran into a momentary issue parsing that request. Please try again or rephrase your mood!',
        timestamp: Date.now()
      };

      set(state => ({
        messages: [...state.messages, errorMessage],
        isLoading: false
      }));
    }
  },

  clearChat: () => set({ messages: [INITIAL_GREETING] })
}));
