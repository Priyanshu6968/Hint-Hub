import { LeetCodeProblem } from '../shared/types';

export class LeetCodeDetector {
  private static getProblemId(): string {
    const url = window.location.href;
    const match = url.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : '';
  }

  private static waitForElement(
    selector: string,
    timeout = 10000
  ): Promise<Element | null> {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  static async detectProblem(): Promise<LeetCodeProblem | null> {
    try {
      const problemId = this.getProblemId();
      if (!problemId) {
        console.log('No problem ID found in URL');
        return null;
      }

      // Wait for problem title to load
      await this.waitForElement('[data-cy="question-title"]', 5000);

      // Extract problem title
      const titleElement = document.querySelector('[data-cy="question-title"]');
      const title = titleElement?.textContent?.trim() || 'Unknown Problem';

      // Extract difficulty
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      const difficultyElement = document.querySelector(
        '[diff], .text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard'
      );
      if (difficultyElement) {
        const diffText =
          difficultyElement.getAttribute('diff') ||
          difficultyElement.textContent?.trim() ||
          '';
        if (diffText.toLowerCase().includes('easy')) difficulty = 'Easy';
        else if (diffText.toLowerCase().includes('hard')) difficulty = 'Hard';
        else if (diffText.toLowerCase().includes('medium'))
          difficulty = 'Medium';
      }

      // Extract problem description
      let description = '';
      const descriptionElement = document.querySelector(
        '[class*="elfjS"], [class*="description"], .question-content'
      );
      if (descriptionElement) {
        description = descriptionElement.textContent?.trim() || '';
      }

      // If description is still empty, try alternative selectors
      if (!description) {
        const contentElement = document.querySelector(
          '[class*="content__"], .content__u3I1'
        );
        if (contentElement) {
          description = contentElement.textContent?.trim() || '';
        }
      }

      return {
        title,
        difficulty,
        description: description.substring(0, 1000), // Limit description length
        url: window.location.href,
        problemId,
      };
    } catch (error) {
      console.error('Error detecting LeetCode problem:', error);
      return null;
    }
  }

  static async getCurrentCode(): Promise<{ code: string; language: string }> {
    try {
      // Wait for Monaco editor to load
      await this.waitForElement('.view-lines', 3000);

      // Try to get code from Monaco editor
      const lines = document.querySelectorAll('.view-line');
      const code = Array.from(lines)
        .map((line) => line.textContent)
        .join('\n');

      // Detect language from language selector
      let language = 'javascript';
      const languageButton = document.querySelector(
        '[id*="headlessui-listbox-button"]'
      );
      if (languageButton) {
        const langText = languageButton.textContent?.trim().toLowerCase() || '';
        if (langText.includes('python')) language = 'python';
        else if (langText.includes('java')) language = 'java';
        else if (langText.includes('c++') || langText.includes('cpp'))
          language = 'cpp';
        else if (langText.includes('javascript')) language = 'javascript';
      }

      return { code, language };
    } catch (error) {
      console.error('Error getting current code:', error);
      return { code: '', language: 'javascript' };
    }
  }

  static observeProblemChanges(callback: () => void): () => void {
    const observer = new MutationObserver(() => {
      const currentProblemId = this.getProblemId();
      if (currentProblemId) {
        callback();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen for URL changes
    let lastUrl = window.location.href;
    const urlObserver = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        callback();
      }
    }, 1000);

    // Return cleanup function
    return () => {
      observer.disconnect();
      clearInterval(urlObserver);
    };
  }
}
