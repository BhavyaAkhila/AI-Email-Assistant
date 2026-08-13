## Backend Dockerfile
# Build artifact externally (CI or local `mvn package`) then build image:
# docker build -t email-assistant-backend:latest --build-arg JAR_FILE=target/assistant-0.0.1-SNAPSHOT.jar .

ARG JAR_FILE=target/assistant-0.0.1-SNAPSHOT.jar
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app
COPY ${JAR_FILE} /app/app.jar
EXPOSE 8097
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
