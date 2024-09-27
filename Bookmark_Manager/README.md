# Bookmark to Google Sheets with Gemini

This Chrome extension automatically syncs bookmarks from specified folders to a Google Sheet and generates descriptions using the Gemini API.

## Setup

### 1. Chrome Extension

1. Clone this repository or download the files.
2. Create a `secrets.js` file in the root directory with your Gemini API key:
   ```javascript
   export const GEMINI_API_KEY = 'your_gemini_api_key_here';
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" in the top right corner.
5. Click "Load unpacked" and select the directory containing the extension files.

### 2. Google Sheet

1. Create a new Google Sheet.
2. Name the first sheet "Bookmarks" (or update the Apps Script accordingly).

### 3. Google Apps Script

1. In your Google Sheet, go to Extensions > Apps Script.
2. Replace the contents of the script editor with the code from `google_app_script.gs`.
3. Save the project and give it a name.
4. Deploy the script as a web app:
   - Click on "Deploy" > "New deployment"
   - Select "Web app" as the type
   - Set "Execute as" to your Google account
   - Set "Who has access" to "Anyone"
   - Click "Deploy" and copy the provided URL

### 4. Update Extension

1. In `background.js`, replace the URL in both `fetch` calls with your Apps Script web app URL.

### 5. Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key.
2. Copy this key into your `secrets.js` file.

## Usage

1. The extension will automatically sync bookmarks added to folders named "Tools" or "Learning" (or their subfolders).
2. When a bookmark is added:
   - It's synced to the Google Sheet
   - A description is generated using the Gemini API
3. When a bookmark is deleted from Chrome, it's also removed from the Sheet.

## Files

- `manifest.json`: Chrome extension configuration
- `background.js`: Main extension logic
- `secrets.js`: Stores the Gemini API key (create this file)
- `google_app_script.gs`: Google Apps Script code for the Sheet integration

## Customization

- To change which folders are synced, modify the `isInAllowedFolder` function in `background.js`.
- Adjust the Gemini API prompt in the `generateDescription` function to change how descriptions are generated.

## Troubleshooting

- Check the Chrome developer console for any error messages.
- Ensure your Gemini API key and Apps Script deployment URL are correct.
- Verify that the Google Sheet and Apps Script are set up correctly and accessible.

## Security Note

Keep your `secrets.js` file secure and never share it publicly, as it contains your API key.