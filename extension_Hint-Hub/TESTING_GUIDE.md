# Testing Guide - Hint Hub Extension

## ✅ Build Successful!

Your extension has been built successfully! The compiled files are in the `dist/` folder.

## Quick Start - Load Extension in Chrome

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Or click the 3-dot menu → Extensions → Manage Extensions

### Step 2: Enable Developer Mode
- Look for the toggle in the **top-right corner**
- Turn ON "Developer mode"

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button (top-left)
2. Navigate to your project folder
3. Select: `extension_Hint-Hub/dist` folder
4. Click "Select Folder"

### Step 4: Verify Installation
You should see:
- ✅ "Hint Hub - AI DSA Assistant" in your extensions list
- ✅ The Hint Hub icon in your Chrome toolbar
- ✅ No errors in the extension card

## Configuration

### Get Your API Key
1. Go to https://openrouter.ai/keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-or-v1-...`)

### Configure the Extension
1. Click the Hint Hub icon in Chrome toolbar
2. Paste your API key in the "OpenRouter API Key" field
3. Select your skill level:
   - **Beginner**: Simple solutions, basic data structures
   - **Intermediate**: HashMaps, Sets, common algorithms
   - **Advanced**: All data structures, optimal solutions
4. Enable "Auto-sync code" (recommended)
5. Enable "Show toggle button" (recommended)
6. Click **"Save Settings"**

## Test the Extension

### Test 1: Visit LeetCode
1. Go to https://leetcode.com/problems/two-sum/
2. Wait for the page to fully load
3. **Expected**: You should see a floating "Hint Hub" button in the bottom-right corner

### Test 2: Open the Sidebar
1. Click the "Hint Hub" button
   - OR press `Ctrl+Shift+H` (Windows/Linux)
   - OR press `Cmd+Shift+H` (Mac)
2. **Expected**: A sidebar slides in from the right showing:
   - "Hint Hub Assistant" header
   - Problem name "Two Sum" with difficulty "Easy"
   - Empty chat interface with welcome message

### Test 3: Get a Hint
1. Type in the chat: "Can you give me a hint?"
2. Click Send or press Enter
3. **Expected**:
   - Your message appears in the chat
   - Loading indicator shows
   - AI responds with a hint (takes 2-5 seconds)

### Test 4: Code Sync
1. Write some code in LeetCode's editor (e.g., a simple function)
2. Click the **"Help with Code"** button in the sidebar
3. **Expected**:
   - Message auto-fills: "Can you help me with my current code?"
   - AI analyzes your code and provides feedback

### Test 5: Conversation Memory
1. Ask a follow-up question: "Can you explain more?"
2. **Expected**: AI remembers the context from previous messages

### Test 6: Problem Navigation
1. Go to a different problem (e.g., https://leetcode.com/problems/add-two-numbers/)
2. **Expected**:
   - Sidebar updates with new problem name
   - Chat history clears (new conversation)

### Test 7: Clear Chat
1. Click the **"Clear Chat"** button
2. **Expected**:
   - All messages disappear
   - Fresh start for the current problem

### Test 8: Close and Reopen
1. Close the sidebar (X button or Ctrl+Shift+H)
2. Reopen it
3. **Expected**: Previous conversation for that problem is restored

## Common Issues & Fixes

### Issue 1: Button Not Appearing
**Symptoms**: No floating button on LeetCode
**Fix**:
- Refresh the LeetCode page (`F5`)
- Make sure you're on a `/problems/...` URL
- Check the console for errors (`F12` → Console tab)
- Verify extension is enabled in `chrome://extensions/`

### Issue 2: API Errors
**Symptoms**: "Payment required" or "API key not configured"
**Fix**:
- Verify API key is correct (no extra spaces)
- Check OpenRouter account has credits: https://openrouter.ai/account
- Make sure you saved settings after entering the key

### Issue 3: Code Not Syncing
**Symptoms**: "Help with Code" doesn't include your code
**Fix**:
- Wait for LeetCode's editor to fully load
- Make sure you've written some code
- Try refreshing the page
- Click "Help with Code" again

### Issue 4: Sidebar Not Opening
**Symptoms**: Nothing happens when clicking button
**Fix**:
- Check browser console for errors (`F12`)
- Check extension background page: `chrome://extensions/` → Details → "Inspect views: service worker"
- Reload the extension

### Issue 5: Styling Issues
**Symptoms**: UI looks broken or overlaps
**Fix**:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try different screen size

## Debugging Tips

### View Console Logs
**Content Script Logs** (runs on LeetCode page):
1. Open LeetCode problem page
2. Press `F12` to open DevTools
3. Go to Console tab
4. Look for messages starting with "Hint Hub:"

**Background Worker Logs** (runs in extension):
1. Go to `chrome://extensions/`
2. Find "Hint Hub - AI DSA Assistant"
3. Click "Details"
4. Click "Inspect views: service worker"
5. Check Console tab

**Popup Logs** (when clicking extension icon):
1. Click Hint Hub icon
2. Right-click inside the popup
3. Select "Inspect"
4. Check Console tab

### Check Storage
To see what's stored:
1. Open DevTools (`F12`)
2. Go to Application tab
3. Expand "Extensions" → "Hint Hub"
4. Check "Local Storage"

## Performance Testing

### Check Memory Usage
1. Open Chrome Task Manager: `Shift+Esc`
2. Find "Hint Hub - AI DSA Assistant"
3. **Expected**: 20-30 MB memory usage

### Check Load Time
1. Refresh LeetCode page
2. Open DevTools Network tab
3. Check extension loads in < 1 second

## Test Different Scenarios

### Test Different Problem Difficulties
- Easy: https://leetcode.com/problems/two-sum/
- Medium: https://leetcode.com/problems/add-two-numbers/
- Hard: https://leetcode.com/problems/median-of-two-sorted-arrays/

### Test Different Problem Types
- Array: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
- String: https://leetcode.com/problems/longest-substring-without-repeating-characters/
- Tree: https://leetcode.com/problems/maximum-depth-of-binary-tree/
- Dynamic Programming: https://leetcode.com/problems/climbing-stairs/

### Test Multiple Conversations
1. Open a problem, ask some questions
2. Navigate to a different problem
3. Go back to first problem
4. **Expected**: Conversation history restored

## Next Steps After Testing

### If Everything Works:
1. ✅ Test on 5-10 different problems
2. ✅ Try all skill levels
3. ✅ Test with friends/beta users
4. ✅ Collect feedback
5. ✅ Prepare for Chrome Web Store submission

### If Issues Found:
1. Document the issue (what happened, what you expected)
2. Check console logs
3. Try the fixes above
4. Report issues with:
   - Screenshot
   - Console logs
   - Steps to reproduce

## Advanced Testing

### Test Keyboard Shortcuts
- `Ctrl+Shift+H`: Toggle sidebar (Windows/Linux)
- `Cmd+Shift+H`: Toggle sidebar (Mac)
- `Enter`: Send message in chat

### Test Edge Cases
1. Very long problem descriptions
2. Multiple rapid messages
3. Switching problems quickly
4. Opening/closing sidebar repeatedly
5. Large code snippets

### Test Browser Compatibility
- Minimum Chrome version: 88+
- Test on Chrome, Edge, Brave (Chromium-based)

## Success Metrics

Your extension is working correctly if:
- ✅ Button appears on all LeetCode problem pages
- ✅ Sidebar opens smoothly with no layout issues
- ✅ AI responds within 2-5 seconds
- ✅ Conversations persist across reopens
- ✅ Code sync works from LeetCode editor
- ✅ No console errors
- ✅ Memory usage stays under 50MB
- ✅ Works on different problem types/difficulties

## Feedback Collection

Test with users and collect:
1. What worked well?
2. What was confusing?
3. Any errors encountered?
4. Feature requests?
5. UI/UX suggestions?

## Ready for Production?

Checklist before Chrome Web Store submission:
- [ ] Tested on 10+ different problems
- [ ] No console errors
- [ ] All features working
- [ ] Good performance (< 30MB RAM)
- [ ] Tested by 3+ beta users
- [ ] Documentation complete
- [ ] Privacy policy created
- [ ] Screenshots prepared (1280x800)
- [ ] Promotional images ready

---

**Having issues?** Check the console logs first, then refer to the troubleshooting section above.

**Everything working?** Congratulations! Your extension is ready for beta testing! 🎉
