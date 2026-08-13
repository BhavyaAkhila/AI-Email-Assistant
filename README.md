AI Email Assistant

Features:
- AI email generation
- Multiple tones
- Multiple lengths
- Regenerate email
- Save emails
- Search previous emails
- JWT authentication
- User registration/login
- MySQL persistence
- REST API
- PDF export

Technology:
- Java
- Spring Boot (4.x)
- Spring Security
- JWT
- MySQL
- Frontend: separate project (React / Vite / Angular — not detected in this repository)
- Gemini API (Generative Language API)
- Maven
- Git/GitHub

Project structure (backend):
- assistant/ - Spring Boot backend
  - src/main/java - Java sources
  - src/main/resources - application.properties files and resources
  - pom.xml - Maven build
  - mvnw, mvnw.cmd, .mvn/ - Maven wrapper (keep committed)

Local setup (backend):
1. Create a local MySQL database, e.g. `email_assistant`.
2. Create a `.env` or set environment variables described below.
3. From the `assistant` folder run:
   - ./mvnw spring-boot:run (Linux/macOS)
   - mvnw.cmd spring-boot:run (Windows)

Local setup (frontend):
- The frontend is a separate project and is not included in this repository. Configure its API URL with an environment variable such as `VITE_API_URL` (Vite), or `REACT_APP_API_URL` (Create React App). Example: VITE_API_URL=http://localhost:8097

Required environment variables (backend):
- DATABASE_URL (optional) - e.g. jdbc:mysql://localhost:3306/email_assistant
- DATABASE_USERNAME - database user
- DATABASE_PASSWORD - database password
- JWT_SECRET - JWT secret (must be at least 32 bytes / 256 bits)
- JWT_EXPIRATION (optional) - token lifetime in ms (default 86400000)
- GEMINI_API_KEY - API key for Gemini / Google Generative Language API
- GEMINI_API_URL (optional) - Gemini endpoint
- FRONTEND_URL - Frontend origin(s), comma-separated for multiple origins (default http://localhost:5173)

Security and deployment notes:
- Do NOT commit real API keys, passwords, or JWT secrets to source control.
- Use environment variables or a secrets manager in production.
- Keep the Maven wrapper (mvnw, mvnw.cmd, .mvn/) committed.
- Do not commit `target/` or build artifacts. Backend .gitignore is in `assistant/.gitignore`.

How to verify locally:
- Ensure environment variables are set (see above).
- Start backend with the Maven wrapper.
- Start frontend separately and set its API URL to point to the backend.

Deployment notes:
- Use CI/CD to inject secrets into the runtime environment (GitHub Actions secrets, Azure Key Vault, AWS Secrets Manager, etc.).
- Configure CORS origins via the FRONTEND_URL environment variable (supports comma-separated values).

This repository has been prepared to avoid committing secrets and to use environment-variable based configuration for production readiness.
