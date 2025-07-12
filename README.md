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

**For macOS:**
```bash
# Use the automated startup script
./start-mac.sh

# Or manually with docker-compose
docker-compose up -d
```

**For Windows:**
```batch
# Use the automated startup script
start-windows.bat

# Or manually with docker-compose
docker-compose up -d
```

**For Linux:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
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

## 💻 Platform-Specific Setup

### 🍎 macOS Setup

#### Prerequisites Installation
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

#### Running the Platform on macOS
```bash
# Clone the repository
git clone https://github.com/Tilakkumar/document-intelligence-platform.git
cd document-intelligence-platform

# Copy and configure environment
cp .env.example .env
# Edit .env file with your preferred text editor
nano .env

# Start Docker Desktop application
open -a Docker

# Wait for Docker to start (you'll see the Docker icon in the menu bar)
# Then start the platform
docker-compose up -d

# Monitor startup progress
docker-compose logs -f backend frontend

# Access the platform at http://localhost:3000
```

#### Troubleshooting macOS
```bash
# If you encounter permission issues
sudo chown -R $(whoami) /usr/local/share/

# If Docker commands fail, ensure Docker Desktop is running
docker system info

# If ports are already in use, check what's using them
lsof -i :3000
lsof -i :8080

# Stop conflicting services
sudo pkill -f "node"
sudo pkill -f "java"

# If you need to reset Docker
docker system prune -a
```

### 🪟 Windows Setup

#### Prerequisites Installation

**Option 1: Using Windows Package Managers (Recommended)**
```powershell
# Install Chocolatey (run PowerShell as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install required software
choco install docker-desktop
choco install openjdk17
choco install nodejs
choco install git

# Verify installations
docker --version
java --version
node --version
npm --version
git --version
```

**Option 2: Manual Installation**
1. **Docker Desktop**: Download from [docker.com](https://www.docker.com/products/docker-desktop-windows)
2. **Java 17**: Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download)
3. **Node.js 18**: Download from [nodejs.org](https://nodejs.org/)
4. **Git**: Download from [git-scm.com](https://git-scm.com/)

#### Running the Platform on Windows
```powershell
# Clone the repository
git clone https://github.com/Tilakkumar/document-intelligence-platform.git
cd document-intelligence-platform

# Copy and configure environment
copy .env.example .env
# Edit .env file with notepad or your preferred editor
notepad .env

# Start Docker Desktop from Start Menu or Desktop shortcut
# Wait for Docker to fully start (check system tray)

# Start the platform
docker-compose up -d

# Monitor startup progress
docker-compose logs -f backend frontend

# Access the platform at http://localhost:3000
```

#### Troubleshooting Windows
```powershell
# Check if Docker is running properly
docker system info

# If ports are in use, find what's using them
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# Kill processes using ports (replace PID with actual process ID)
taskkill /PID 1234 /F

# If you encounter WSL issues with Docker Desktop
wsl --update
wsl --set-default-version 2

# Enable required Windows features (run as Administrator)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform

# Restart computer after enabling features
```

### 🐧 Linux (Ubuntu/Debian) Setup

#### Prerequisites Installation
```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Java 17
sudo apt install openjdk-17-jdk

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git

# Log out and back in for Docker group changes
# Verify installations
docker --version
docker-compose --version
java --version
node --version
```

#### Running the Platform on Linux
```bash
# Clone the repository
git clone https://github.com/Tilakkumar/document-intelligence-platform.git
cd document-intelligence-platform

# Copy and configure environment
cp .env.example .env
# Edit with your preferred editor
nano .env

# Start the platform
docker-compose up -d

# Monitor startup logs
docker-compose logs -f

# Access the platform at http://localhost:3000
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

## 📋 System Requirements

### Minimum Requirements
- CPU: 2 cores
- RAM: 4GB
- Storage: 10GB
- Docker: 20.10+
- Docker Compose: 2.0+

### Recommended Requirements
- CPU: 4 cores
- RAM: 8GB
- Storage: 50GB
- SSD storage for better performance

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Encryption**: AES-256 encryption at rest
- **Transport Security**: TLS 1.3 encryption
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting protection

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

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## 🎯 Quick Setup Scripts

For easy setup on different platforms, use the provided scripts:

### macOS
```bash
# Make script executable and run
chmod +x start-mac.sh
./start-mac.sh
```

### Windows
```batch
# Double-click or run from command prompt
start-windows.bat
```

These scripts will:
- Check for required dependencies
- Verify Docker is running
- Check for port conflicts
- Create environment file from template
- Start all services
- Verify service health
- Provide access URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Contact the development team

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced OCR capabilities
- [ ] Workflow automation
- [ ] Integration with cloud storage
- [ ] Mobile application
- [ ] Advanced analytics dashboard

---

Built with ❤️ using modern technologies for intelligent document processing.