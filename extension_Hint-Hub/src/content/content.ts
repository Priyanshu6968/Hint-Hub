import { LeetCodeDetector } from './leetcode-detector';
import { LeetCodeProblem } from '../shared/types';

console.log('Hint Hub: Content script loaded on LeetCode');

let currentProblem: LeetCodeProblem | null = null;
let sidebarInjected = false;
let sidebarVisible = false;

// Initialize
async function initialize() {
  console.log('Hint Hub: Initializing...');

  // Detect current problem
  currentProblem = await LeetCodeDetector.detectProblem();
  if (currentProblem) {
    console.log('Hint Hub: Detected problem:', currentProblem.title);
  }

  // Create toggle button
  createToggleButton();

  // Observe problem changes
  LeetCodeDetector.observeProblemChanges(async () => {
    console.log('Hint Hub: Problem changed, reloading...');
    currentProblem = await LeetCodeDetector.detectProblem();
    if (sidebarInjected && sidebarVisible) {
      updateSidebarProblem();
    }
  });
}

function createToggleButton() {
  // Check if button already exists
  if (document.getElementById('hint-hub-toggle-btn')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'hint-hub-toggle-btn';
  button.className = 'hint-hub-toggle-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
    <span>Hint Hub</span>
  `;
  button.title = 'Toggle Hint Hub Assistant (Ctrl+Shift+H)';

  button.addEventListener('click', toggleSidebar);

  document.body.appendChild(button);
}

function toggleSidebar() {
  if (!sidebarInjected) {
    injectSidebar();
  } else {
    const sidebar = document.getElementById('hint-hub-sidebar');
    if (sidebar) {
      sidebarVisible = !sidebarVisible;
      sidebar.style.display = sidebarVisible ? 'flex' : 'none';
    }
  }
}

function injectSidebar() {
  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'hint-hub-sidebar';
  sidebar.className = 'hint-hub-sidebar';

  // Create sidebar iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'hint-hub-sidebar-iframe';
  iframe.src = chrome.runtime.getURL('src/sidebar/sidebar.html');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  sidebar.appendChild(iframe);
  document.body.appendChild(sidebar);

  sidebarInjected = true;
  sidebarVisible = true;

  // Setup communication with sidebar
  setupSidebarCommunication(iframe);
}

function setupSidebarCommunication(iframe: HTMLIFrameElement) {
  window.addEventListener('message', async (event) => {
    // Only accept messages from our iframe
    if (event.source !== iframe.contentWindow) {
      return;
    }

    const { type, payload } = event.data;

    switch (type) {
      case 'SIDEBAR_READY':
        // Send initial problem data to sidebar
        sendToSidebar(iframe, 'PROBLEM_DATA', currentProblem);
        break;

      case 'GET_CURRENT_CODE':
        const codeData = await LeetCodeDetector.getCurrentCode();
        sendToSidebar(iframe, 'CURRENT_CODE', codeData);
        break;

      case 'CLOSE_SIDEBAR':
        toggleSidebar();
        break;
    }
  });
}

function sendToSidebar(iframe: HTMLIFrameElement, type: string, payload: any) {
  iframe.contentWindow?.postMessage({ type, payload }, '*');
}

function updateSidebarProblem() {
  const iframe = document.getElementById(
    'hint-hub-sidebar-iframe'
  ) as HTMLIFrameElement;
  if (iframe) {
    sendToSidebar(iframe, 'PROBLEM_DATA', currentProblem);
  }
}

// Keyboard shortcut: Ctrl+Shift+H
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'H') {
    event.preventDefault();
    toggleSidebar();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
