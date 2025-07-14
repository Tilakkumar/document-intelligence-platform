# Document Intelligence Platform

A comprehensive document processing and analysis platform powered by AI and machine learning technologies.

## 🚀 Features

- **Document Upload & Processing**: Support for PDF, Word, Text, and Image files
- **AI-Powered Analysis**: Entity extraction, sentiment analysis, and document classification
- **Advanced Search**: Semantic search with filtering and categorization
- **Real-time Analytics**: System performance monitoring and usage statistics
- **Scalable Architecture**: Microservices with Docker containerization
- **Modern UI**: React-based responsive web interface

## 🏗️ Architecture

### Backend (Java/Spring Boot)
- **Document Processing**: Apache Tika integration for text extraction
- **AI Services**: OpenAI GPT-4o for intelligent analysis
- **Database**: MongoDB for document storage and metadata
- **Caching**: Redis for performance optimization
- **Search**: Elasticsearch for advanced document search

### Frontend (React/TypeScript)
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Updates**: WebSocket connections for live updates
- **Analytics Dashboard**: Charts and metrics visualization
- **File Management**: Drag-and-drop upload interface

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Load Balancing**: Nginx reverse proxy
- **Monitoring**: Prometheus and Grafana
- **Security**: SSL/TLS encryption and authentication

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API Key
- 4GB+ RAM available

### 1. Clone the Repository
```bash
git clone https://github.com/Tilakkumar/document-intelligence-platform.git
cd document-intelligence-platform
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your OpenAI API key
nano .env
```

### 3. Start Services

```bash
docker-compose up -d
```


### 4. Access the Platform
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Analytics Dashboard**: http://localhost:3001 (Grafana)
- **System Monitoring**: http://localhost:9090 (Prometheus)

## 📊 Service Endpoints

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Web Interface |
| Backend | 8080 | http://localhost:8080 | REST API |
| MongoDB | 27017 | mongodb://localhost:27017 | Database |
| Redis | 6379 | redis://localhost:6379 | Cache |
| Tika | 9998 | http://localhost:9998 | Document Processing |
| Elasticsearch | 9200 | http://localhost:9200 | Search Engine |
| Kibana | 5601 | http://localhost:5601 | Search Analytics |
| Prometheus | 9090 | http://localhost:9090 | Metrics |
| Grafana | 3001 | http://localhost:3001 | Dashboards |

## 🔧 Configuration

### Database Configuration
The platform uses MongoDB for document storage. Default credentials:
- Username: `admin`
- Password: `password123`
- Database: `document_intelligence`

### AI Services
Configure your OpenAI API key in the `.env` file:
```
OPENAI_API_KEY=sk-your-api-key-here
```

### File Upload Limits
- Maximum file size: 100MB
- Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
- Concurrent uploads: 5 files

## 📖 API Documentation

### Upload Document
```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Analyze Document
```bash
curl -X POST http://localhost:8080/api/documents/{id}/analyze \
  -H "Content-Type: application/json"
```

### Search Documents
```bash
curl -X GET "http://localhost:8080/api/documents?search=query&page=0&size=10" \
  -H "Content-Type: application/json"
```

## Prerequisites Installation
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Install Java 17 (for local development)
brew install openjdk@17

# Install Node.js 18 (for frontend development)
brew install node@18

# Verify installations
docker --version
java --version
node --version
npm --version
```


## 🛠️ Development

### Local Development Setup (Without Docker)

#### Backend Development
```bash
# Navigate to backend directory
cd backend

# Install dependencies (requires Maven)
./mvnw clean install

# Configure application properties
cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties

# Start required services (MongoDB, Redis, Elasticsearch)
docker-compose up -d mongo redis elasticsearch

# Start the backend service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server with hot reload
npm start

# Build for production
npm run build
```

### Running Tests
```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:coverage
```

### Environment Variables
Create a `.env` file with the following configuration:
```bash
# Database Configuration
MONGODB_URI=mongodb://admin:password123@mongo:27017/document_intelligence
REDIS_URL=redis://redis:6379

# AI Configuration
OPENAI_API_KEY=your-openai-api-key-here
TIKA_SERVER_URL=http://tika:9998

# Application Configuration
BACKEND_PORT=8080
FRONTEND_PORT=3000
JWT_SECRET=your-jwt-secret-key

# File Storage
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=100MB

# Logging
LOG_LEVEL=INFO

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://elasticsearch:9200

# Security
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
```

## 📊 Monitoring & Analytics

### System Metrics
- Document processing volume
- API response times
- Resource utilization
- Error rates and logs

### Business Metrics
- Document type distribution
- Entity extraction statistics
- User activity patterns
- Processing performance trends

