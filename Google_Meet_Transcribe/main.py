import os
import csv
import google.generativeai as genai
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import base64
import tkinter as tk
from tkinter import filedialog
import markdown
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Gemini API key
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Set up Gmail API credentials
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
def get_gmail_service():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('Oauth_credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return build('gmail', 'v1', credentials=creds)

service = get_gmail_service()

def extract_text(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def summarize_text(text, prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(f"{prompt}\n\n{text}")
    return response.text

def save_summary(summary, file_path):
    with open(file_path, 'w') as file:
        file.write(summary)

def create_attachment(file_path, filename):
    """Create a file attachment for an email"""
    attachment = MIMEBase('application', 'octet-stream')
    with open(file_path, 'rb') as file:
        attachment.set_payload(file.read())
    encoders.encode_base64(attachment)
    attachment.add_header('Content-Disposition', f'attachment; filename={filename}')
    return attachment

def send_email(to, subject, markdown_body, attachment_path):
    message = MIMEMultipart('mixed')
    message['to'] = to
    message['subject'] = subject
    
    # Create the body of the message (a plain-text and an HTML version).
    message_alt = MIMEMultipart('alternative')
    
    # Attach the Markdown version
    message_alt.attach(MIMEText(markdown_body, 'plain'))
    
    # Convert Markdown to HTML and attach
    html_body = markdown.markdown(markdown_body)
    message_alt.attach(MIMEText(html_body, 'html'))
    
    message.attach(message_alt)
    
    # Add the attachment
    filename = os.path.basename(attachment_path)
    attachment = create_attachment(attachment_path, filename)
    message.attach(attachment)
    
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    
    try:
        message = service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        print(f"Message Id: {message['id']} sent to {to}")
    except Exception as error:
        print(f"An error occurred: {error}")

def markdown_to_pdf(markdown_file, pdf_file):
    # Read the Markdown file
    with open(markdown_file, 'r', encoding='utf-8') as file:
        markdown_text = file.read()

    # Convert Markdown to HTML
    html = markdown.markdown(markdown_text)

    # Create a PDF document
    doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)

    # Create styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=4))  # 4 is for justified text

    # Convert HTML to Reportlab elements
    elements = []
    for line in html.split('\n'):
        if line.strip():
            elements.append(Paragraph(line, styles['Justify']))

    # Build the PDF
    doc.build(elements)

def main():
    # <------------------------------------------------------------------------------------------------------------------->
    # Step 1: Extract text from file

    def select_file():
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        file_path = filedialog.askopenfilename(
            title="Select Transcription File",
            filetypes=[("Text files", "*.txt")]
        )
        return file_path

    upload_transcription_location = select_file()
    if not upload_transcription_location:
        print("No file selected. Exiting.")
        return

    meeting_title = os.path.basename(upload_transcription_location).split('.')[0]
    transcription = extract_text(upload_transcription_location)

    # <------------------------------------------------------------------------------------------------------------------->
    # Step 2: Summarize text using Gemini
    gemini_prompt = """
        Please summarize the following meeting transcription with a clear and structured format. Use the following headings to guide your response:

        Meeting Title:
        [Infer an appropriate title based on the main discussion topics in the transcription]

        Date and Time:
        [Extract or infer the date and time of the meeting from the transcription]

        Attendees:
        [List all participants mentioned in the transcription]

        Agenda:
        [Summarize the primary topics or goals of the meeting]

        Key Points Discussed:
        [Bullet points summarizing the most important discussions or ideas shared during the meeting]

        Decisions Made:
        [List any concrete decisions or agreements made during the meeting]

        Action Items:
        [Identify the specific tasks or follow-ups assigned during the meeting, specifying the responsible person and any deadlines mentioned]

        To-Do List by Person:
        [Organize tasks by individual participants, listing their responsibilities]

        Next Steps:
        [Outline any planned follow-up actions, including future meetings or additional tasks that need attention]

        Additional Notes:
        [Include any other relevant information not covered by the above categories]
        """

    summary = summarize_text(transcription, gemini_prompt)

    # <------------------------------------------------------------------------------------------------------------------>
    # Step 3: Save summary to file (Markdown)
    # Define the base directory for summaries
    summary_dir = os.path.join(os.path.expanduser("~"), "Desktop", "Folders", "Others", "Meeting Notes", "summaries")

    # Create the directory if it doesn't exist
    os.makedirs(summary_dir, exist_ok=True)

    # Define file paths
    markdown_file = os.path.join(summary_dir, f"{meeting_title}_summarised.md")
    text_file = os.path.join(summary_dir, f"{meeting_title}_summary.txt")

    # Save summary as Markdown
    save_summary(summary, markdown_file)

    # Save summary as plain text
    with open(text_file, 'w') as file:
        file.write(summary)

    # Store the text file path for later use in email attachment
    text_attachment_path = text_file

    # <------------------------------------------------------------------------------------------------------------------->
    # Step 4: Getting Recipients and sending emails
    recipients = []
    csv_file_path = 'recipients.csv' 

    with open(csv_file_path, 'r') as csv_file:
        csv_reader = csv.reader(csv_file)
        for row in csv_reader:
            if len(row) >= 1:
                email = row[0].strip()
                recipients.append({'email': email})

    email_subject = "Summary of the Meeting: " + meeting_title

    markdown_body = f"""

    {summary}

    ---

    Thank you for attending the meeting. If you have any questions or need clarification, please don't hesitate to reach out.

    Kind Regards,
    Sameer Gupta

    P.S. A text file with the meeting summary is attached for your convenience."""

    for recipient in recipients:
        send_email(recipient['email'], email_subject, markdown_body, text_attachment_path)

if __name__ == "__main__":
    main()