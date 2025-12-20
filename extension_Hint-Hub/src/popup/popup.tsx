import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Settings, Sparkles, ExternalLink, Check } from 'lucide-react';
import '../styles/globals.css';
import './popup.css';
import { sendMessageToBackground, getCurrentTab } from '../shared/messaging';
import { UserSettings } from '../shared/types';

function Popup() {
  const [settings, setSettings] = useState<UserSettings>({
    skillLevel: 'Intermediate',
    autoSync: true,
    showToggleButton: true,
  });
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [isOnLeetCode, setIsOnLeetCode] = useState(false);

  useEffect(() => {
    loadSettings();
    checkIfOnLeetCode();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await sendMessageToBackground({ type: 'GET_SETTINGS' });
      if (response.success && response.settings) {
        setSettings(response.settings);
        setApiKey(response.settings.apiKey || '');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const checkIfOnLeetCode = async () => {
    const tab = await getCurrentTab();
    if (tab?.url?.includes('leetcode.com')) {
      setIsOnLeetCode(true);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await sendMessageToBackground({
        type: 'SAVE_SETTINGS',
        payload: { ...settings, apiKey },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const openHintHub = () => {
    chrome.tabs.create({ url: 'https://your-hint-hub-url.com' });
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="popup-header">
        <div className="icon-gradient">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="popup-title">Hint Hub</h1>
          <p className="popup-subtitle">AI DSA Assistant</p>
        </div>
      </div>

      {/* LeetCode Status */}
      {isOnLeetCode ? (
        <div className="status-card status-active">
          <div className="status-indicator"></div>
          <div>
            <p className="status-title">Active on LeetCode</p>
            <p className="status-text">
              Click the Hint Hub button on the page or press Ctrl+Shift+H
            </p>
          </div>
        </div>
      ) : (
        <div className="status-card status-inactive">
          <p className="status-text">
            Visit a LeetCode problem page to use Hint Hub
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="settings-section">
        <div className="section-header">
          <Settings size={16} />
          <h2>Settings</h2>
        </div>

        {/* API Key */}
        <div className="setting-item">
          <label htmlFor="apiKey">OpenRouter API Key</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="input-field"
          />
          <p className="help-text">
            Get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenRouter
            </a>
          </p>
        </div>

        {/* Skill Level */}
        <div className="setting-item">
          <label htmlFor="skillLevel">Skill Level</label>
          <select
            id="skillLevel"
            value={settings.skillLevel}
            onChange={(e) =>
              setSettings({
                ...settings,
                skillLevel: e.target.value as any,
              })
            }
            className="select-field"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <p className="help-text">
            Determines the complexity of hints and solutions
          </p>
        </div>

        {/* Auto Sync */}
        <div className="setting-item-row">
          <div>
            <label>Auto-sync code</label>
            <p className="help-text">Automatically sync your code with hints</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSync}
            onChange={(e) =>
              setSettings({ ...settings, autoSync: e.target.checked })
            }
            className="checkbox"
          />
        </div>

        {/* Show Toggle Button */}
        <div className="setting-item-row">
          <div>
            <label>Show toggle button</label>
            <p className="help-text">Display floating button on LeetCode</p>
          </div>
          <input
            type="checkbox"
            checked={settings.showToggleButton}
            onChange={(e) =>
              setSettings({ ...settings, showToggleButton: e.target.checked })
            }
            className="checkbox"
          />
        </div>

        {/* Save Button */}
        <button onClick={handleSaveSettings} className="save-button">
          {saved ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="popup-footer">
        <button onClick={openHintHub} className="link-button">
          <ExternalLink size={14} />
          Open Hint Hub Web App
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Popup />);
