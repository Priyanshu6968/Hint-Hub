export interface Message {
  type: string;
  payload?: any;
}

export interface LeetCodeProblem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  url: string;
  problemId: string;
  testCases?: string[];
  constraints?: string;
}

export interface UserCode {
  code: string;
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConversationSession {
  problemId: string;
  messages: ChatMessage[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserSettings {
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  autoSync: boolean;
  showToggleButton: boolean;
  apiKey?: string;
}
