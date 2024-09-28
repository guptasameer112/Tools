# Meeting Summarizer

The Meeting Summarizer is an automated tool designed to streamline the process of summarizing and distributing meeting notes. It takes a meeting transcription as input, uses the Gemini AI model to generate a comprehensive summary, and then emails this summary to specified recipients. This tool is particularly useful for teams looking to improve their meeting documentation and follow-up processes.

Key features:
- Automatic summarization of meeting transcriptions using AI
- Structured summary output with key sections (e.g., attendees, decisions, action items)
- Email distribution of summaries to specified recipients
- Integration with Gmail for sending emails
- Support for both Markdown and plain text summary formats

## Prerequisites

Before setting up the Meeting Summarizer, you need to obtain the text file of the meeting transcriptions. Use the Chrome extension "Transcriptonic" available at https://github.com/vivek-nexus/transcriptonic to generate these transcription files.

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
