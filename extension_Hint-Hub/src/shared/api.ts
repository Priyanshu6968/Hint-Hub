import { ChatMessage } from './types';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet";

export const getSystemPrompt = (
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
) => {
  const basePrompt = `You are a problem-solving guide assistant helping users through algorithmic and programming challenges. Guide users through three stages: first, ensure they understand what the question is asking; second, help them determine the algorithm needed; third, support them in implementing the algorithm in code.

Provide concise hints (no more than 3 lines) that stimulate critical thinking. Ask thoughtful, probing questions rather than giving direct answers. Encourage users to devise their own solutions.

IMPORTANT GUIDELINES:
1. Start with plain English explanations before providing code
2. Provide code only when explicitly requested
3. Focus on understanding first, implementation second
4. Encourage self-discovery through guided questions
5. Most questions are LeetCode problems`;

  switch (skillLevel) {
    case 'Beginner':
      return basePrompt + `

BEGINNER MODE:
- Use only basic data structures: arrays, simple loops, conditionals
- Avoid: HashMaps, Sets, Trees, advanced algorithms
- Explain in very simple terms with step-by-step breakdowns`;

    case 'Intermediate':
      return basePrompt + `

INTERMEDIATE MODE:
- Use: Arrays, HashMaps, Sets, Stacks, Queues, basic Trees
- Use: Two Pointers, Sliding Window algorithms
- Explain time and space complexity simply`;

    case 'Advanced':
      return basePrompt + `

ADVANCED MODE:
- Use all data structures and algorithms
- Focus on optimal solutions with best complexity
- Discuss trade-offs between approaches`;

    default:
      return basePrompt;
  }
};

interface AIRequestParams {
  userMessage: string;
  problemContext?: string;
  code?: string;
  language?: string;
  conversationHistory: ChatMessage[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  apiKey: string;
}

export async function getAIResponse({
  userMessage,
  problemContext,
  code,
  language,
  conversationHistory,
  skillLevel,
  apiKey,
}: AIRequestParams): Promise<string> {
  if (!apiKey) {
    throw new Error("API key not configured");
  }

  // Build context message
  let contextMessage = '';

  if (problemContext) {
    contextMessage += `PROBLEM:\n${problemContext}\n\n`;
  }

  if (language) {
    contextMessage += `LANGUAGE: ${language}\n\n`;
  }

  if (code && code.trim()) {
    contextMessage += `USER'S CODE:\n${code}\n\n`;
  }

  contextMessage += `USER'S MESSAGE:\n${userMessage}`;

  // Build messages array for API
  const messages = [
    {
      role: 'system',
      content: getSystemPrompt(skillLevel),
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    {
      role: 'user',
      content: contextMessage,
    },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': chrome.runtime.getURL(''),
      'X-Title': 'Hint Hub Extension',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`
    );
  }

  const data = await response.json();
  const responseText = data?.choices?.[0]?.message?.content;

  if (!responseText) {
    throw new Error('Invalid response from AI');
  }

  return responseText;
}
