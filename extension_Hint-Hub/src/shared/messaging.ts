export const sendMessageToBackground = async <T = any>(
  message: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

export const sendMessageToTab = async <T = any>(
  tabId: number,
  message: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
};
