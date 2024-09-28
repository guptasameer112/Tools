# Meeting Summarizer

## Setup

1. Clone the repository
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the project root with the following content:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Set up OAuth credentials for Gmail API:
   - Go to the Google Cloud Console (https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API for your project
   - Create OAuth 2.0 credentials (OAuth client ID)
   - Choose "Desktop app" as the application type
   - Download the credentials and save the file as `Oauth_credentials.json` in the project root
5. Edit the `recipients.csv` file to include the email addresses of the recipients who should receive the meeting summary

## Usage

Run the script:
```
python main.py
```

