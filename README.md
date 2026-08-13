# 🤖 AI Email Assistant

An AI-powered email assistant that helps users generate professional emails quickly from simple prompts. It supports different tones, email lengths, multiple languages, and allows users to save and manage their generated emails.

## Features ✨

- **🤖 AI Email Generation** – Generate professional emails from simple prompts
- **🌐 Native Language Prompts** – Give prompts in your native language and generate polished emails
- **🎨 Multiple Tones** – Professional, Friendly, Formal, Apology, Thank You, and Follow-up
- **📏 Multiple Lengths** – Generate Short, Medium, or Long emails
- **🔄 Regenerate Email** – Quickly generate a different version of an email
- **💾 Save Emails** – Save generated emails for future use
- **🔍 Search Emails** – Easily find previously saved emails
- **📋 Copy to Clipboard** – Copy generated emails instantly
- **🔐 User Authentication** – Secure registration and login using JWT

## Tech Stack 🛠️

- **Frontend:** React
- **Backend:** Spring Boot
- **AI:** Google Gemini API
- **Database:** MySQL
- **Authentication:** JWT
- **Build Tool:** Maven
- **Testing:** Postman
- **Version Control:** Git & GitHub

## Prerequisites 📋

- Java 25+
- Maven
- Node.js & npm
- MySQL 8+
- Google Gemini API Key

## Installation & Setup ⚙️

1. **Clone the repository**
   ```bash
   git clone https://github.com/BhavyaAkhila/AI-Email-Assistant.git
   cd AI-Email-Assistant

Configure the backend environment variables

Set the following variables:

DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
GEMINI_API_KEY
FRONTEND_URL

Run the backend

cd assistant
./mvnw spring-boot:run

Run the frontend

cd frontend
npm install
npm run dev
Open the frontend in your browser and start generating emails.
Example Prompt 🚀
"Write an email to my professor asking for an extension on my assignment."

You can also provide the prompt in your native language, and the AI can generate a professional email based on your request.

Key API Endpoints 📡
Endpoint	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Login and receive JWT
/api/ai/generate	POST	Generate an AI-powered email
/api/ai/save	POST	Save a generated email
/api/emails	GET	View saved emails
Project Structure 📁
AI-Email-Assistant/
├── assistant/        # Spring Boot Backend
├── frontend/         # React Frontend
├── README.md
└── .gitignore
Security 🔒

API keys, database passwords, and JWT secrets are managed using environment variables and are not stored in the repository.

Future Enhancements 🚀
Gmail integration
Browser extension
Email summarization
Smart email replies
Voice-based email generation
Support for more languages
