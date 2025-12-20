# Hint Hub Browser Extension

AI-powered DSA assistant that works directly on LeetCode - no more switching tabs!

## Features

- **Smart Problem Detection**: Automatically detects LeetCode problems
- **AI Hints**: Get intelligent hints without leaving LeetCode
- **Code Sync**: Analyzes your code directly from the editor
- **Conversation Memory**: Maintains context throughout your session
- **Skill Levels**: Beginner, Intermediate, and Advanced modes
- **Keyboard Shortcuts**: Quick access with `Ctrl+Shift+H`

## Installation

### Development Mode

1. **Install dependencies:**
   ```bash
   cd extension_Hint-Hub
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension_Hint-Hub/dist` folder

### Production Build

```bash
npm run build
npm run package
```

This creates a `.zip` file ready for Chrome Web Store submission.

## Setup

1. Get your OpenRouter API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Click the Hint Hub extension icon
3. Enter your API key in settings
4. Choose your skill level
5. Visit any LeetCode problem page
6. Click the "Hint Hub" button or press `Ctrl+Shift+H`

## Usage

### Quick Start
1. Navigate to any LeetCode problem
2. Click the floating "Hint Hub" button (bottom-right)
3. Start asking for hints!

### Getting Code Help
1. Write your code in LeetCode's editor
2. Click "Help with Code" in the sidebar
3. Get contextual hints based on your code

### Keyboard Shortcuts
- `Ctrl+Shift+H`: Toggle sidebar
- `Enter`: Send message

## Architecture

```
extension_Hint-Hub/
├── src/
│   ├── background/          # Service worker for API calls
│   ├── content/             # Scripts injected into LeetCode
│   ├── popup/               # Extension popup UI
│   ├── sidebar/             # AI assistant sidebar
│   ├── shared/              # Shared utilities and types
│   └── styles/              # Global styles
├── manifest.json            # Extension configuration
├── vite.config.ts          # Build configuration
└── package.json
```

## Tech Stack

- **React** + **TypeScript**: UI components
- **Vite**: Build tool
- **CRXJS**: Chrome extension plugin for Vite
- **Tailwind CSS**: Styling
- **OpenRouter API**: AI integration (Claude 3.5 Sonnet)

## API Configuration

The extension uses OpenRouter API with Claude 3.5 Sonnet. You can modify the model in `src/shared/api.ts`:

```typescript
const OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet";
```

## Privacy

- All data stored locally in browser storage
- API calls go directly to OpenRouter
- No data sent to third-party servers
- Conversation history stored per problem

## Troubleshooting

### Extension not loading
- Make sure you're on a LeetCode problem page (`/problems/...`)
- Try refreshing the page
- Check console for errors

### API errors
- Verify your API key is correct
- Check OpenRouter account has credits
- Ensure you're connected to the internet

### Code sync not working
- Make sure the LeetCode editor is fully loaded
- Try clicking "Help with Code" again
- Refresh the page and retry

## Development

### Hot Reload
```bash
npm run dev
```
This enables hot module replacement for faster development.

### Type Checking
TypeScript types are checked during build. For manual checking:
```bash
npx tsc --noEmit
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly on LeetCode
5. Submit a pull request

## License

MIT License - see main project for details

## Support

For issues and questions:
- GitHub Issues: [Your repo URL]
- Email: [Your email]
- Web App: [Your Hint Hub URL]

## Roadmap

- [ ] Firefox support
- [ ] Edge support
- [ ] Progress sync with web app
- [ ] Study plan integration
- [ ] Voice hints
- [ ] Collaborative mode
- [ ] Analytics dashboard

---

Made with 💜 by the Hint Hub team
