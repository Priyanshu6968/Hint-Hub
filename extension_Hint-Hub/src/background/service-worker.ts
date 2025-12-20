import { storage } from '../shared/storage';
import { getAIResponse } from '../shared/api';
import { ChatMessage, UserSettings } from '../shared/types';

console.log('Hint Hub: Background service worker started');

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Hint Hub: Received message:', message.type);

  switch (message.type) {
    case 'GET_AI_RESPONSE':
      handleGetAIResponse(message.payload, sendResponse);
      return true; // Keep channel open for async response

    case 'SAVE_CONVERSATION':
      handleSaveConversation(message.payload, sendResponse);
      return true;

    case 'GET_CONVERSATION':
      handleGetConversation(message.payload, sendResponse);
      return true;

    case 'CLEAR_CONVERSATION':
      handleClearConversation(message.payload, sendResponse);
      return true;

    case 'GET_SETTINGS':
      handleGetSettings(sendResponse);
      return true;

    case 'SAVE_SETTINGS':
      handleSaveSettings(message.payload, sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
      return false;
  }
});

async function handleGetAIResponse(
  payload: {
    userMessage: string;
    problemContext?: string;
    code?: string;
    language?: string;
    problemId: string;
  },
  sendResponse: (response: any) => void
) {
  try {
    // Get settings for API key and skill level
    const settings = await storage.get<UserSettings>('settings');
    if (!settings?.apiKey) {
      sendResponse({
        error: 'API key not configured. Please set it in extension settings.',
      });
      return;
    }

    // Get conversation history
    const conversationKey = `conversation_${payload.problemId}`;
    const conversation = await storage.get<ChatMessage[]>(conversationKey);
    const conversationHistory = conversation || [];

    // Get AI response
    const aiResponse = await getAIResponse({
      userMessage: payload.userMessage,
      problemContext: payload.problemContext,
      code: payload.code,
      language: payload.language,
      conversationHistory,
      skillLevel: settings.skillLevel || 'Intermediate',
      apiKey: settings.apiKey,
    });

    // Save new messages to conversation
    const newMessages: ChatMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: payload.userMessage,
        timestamp: Date.now(),
      },
      {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      },
    ];

    await storage.set(conversationKey, newMessages);

    sendResponse({ success: true, response: aiResponse });
  } catch (error) {
    console.error('Error getting AI response:', error);
    sendResponse({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}

async function handleSaveConversation(
  payload: { problemId: string; messages: ChatMessage[] },
  sendResponse: (response: any) => void
) {
  try {
    const conversationKey = `conversation_${payload.problemId}`;
    await storage.set(conversationKey, payload.messages);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error saving conversation:', error);
    sendResponse({ error: 'Failed to save conversation' });
  }
}

async function handleGetConversation(
  payload: { problemId: string },
  sendResponse: (response: any) => void
) {
  try {
    const conversationKey = `conversation_${payload.problemId}`;
    const messages = await storage.get<ChatMessage[]>(conversationKey);
    sendResponse({ success: true, messages: messages || [] });
  } catch (error) {
    console.error('Error getting conversation:', error);
    sendResponse({ error: 'Failed to get conversation' });
  }
}

async function handleClearConversation(
  payload: { problemId: string },
  sendResponse: (response: any) => void
) {
  try {
    const conversationKey = `conversation_${payload.problemId}`;
    await storage.remove(conversationKey);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    sendResponse({ error: 'Failed to clear conversation' });
  }
}

async function handleGetSettings(sendResponse: (response: any) => void) {
  try {
    const settings = await storage.get<UserSettings>('settings');
    const defaultSettings: UserSettings = {
      skillLevel: 'Intermediate',
      autoSync: true,
      showToggleButton: true,
    };
    sendResponse({ success: true, settings: settings || defaultSettings });
  } catch (error) {
    console.error('Error getting settings:', error);
    sendResponse({ error: 'Failed to get settings' });
  }
}

async function handleSaveSettings(
  payload: Partial<UserSettings>,
  sendResponse: (response: any) => void
) {
  try {
    const currentSettings = await storage.get<UserSettings>('settings');
    const newSettings = { ...currentSettings, ...payload };
    await storage.set('settings', newSettings);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    sendResponse({ error: 'Failed to save settings' });
  }
}

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Hint Hub: Extension installed/updated', details.reason);

  if (details.reason === 'install') {
    // Set default settings on first install
    const defaultSettings: UserSettings = {
      skillLevel: 'Intermediate',
      autoSync: true,
      showToggleButton: true,
    };
    storage.set('settings', defaultSettings);
  }
});
