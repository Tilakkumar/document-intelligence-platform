#!/bin/bash

# Document Intelligence Platform - macOS Startup Script
echo "🚀 Starting Document Intelligence Platform on macOS..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop for Mac."
    echo "   You can download it from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker system info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    echo "   You can start it from Applications or by clicking the Docker icon in the menu bar."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not available. Please ensure Docker Desktop is properly installed."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit the .env file and add your OpenAI API key before proceeding."
    echo "   You can edit it with: nano .env"
    read -p "Press Enter after you've configured the .env file..."
fi

# Check for required ports
echo "🔍 Checking for port conflicts..."
PORTS=(3000 8080 27017 6379 9200)
CONFLICTS=()

for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        CONFLICTS+=($port)
    fi
done

if [ ${#CONFLICTS[@]} -ne 0 ]; then
    echo "⚠️  Warning: The following ports are already in use: ${CONFLICTS[*]}"
    echo "   You may need to stop other services or the application might not start properly."
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose pull

# Start the platform
echo "🌟 Starting Document Intelligence Platform..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
HEALTHY=true

# Check if containers are running
SERVICES=("frontend" "backend" "mongo" "redis" "elasticsearch" "tika")
for service in "${SERVICES[@]}"; do
    if ! docker-compose ps $service | grep -q "Up"; then
        echo "❌ $service is not running properly"
        HEALTHY=false
    else
        echo "✅ $service is running"
    fi
done

if [ "$HEALTHY" = true ]; then
    echo ""
    echo "🎉 Document Intelligence Platform is now running!"
    echo ""
    echo "📊 Access your services:"
    echo "   🌐 Web Interface:      http://localhost:3000"
    echo "   🔧 API Documentation:  http://localhost:8080/swagger-ui.html"
    echo "   📈 Grafana Dashboard:  http://localhost:3001 (admin/admin123)"
    echo "   📊 Prometheus:         http://localhost:9090"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop platform: docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo ""
    
    # Ask if user wants to open the web interface
    read -p "Would you like to open the web interface now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
else
    echo ""
    echo "❌ Some services failed to start properly."
    echo "📋 Check the logs with: docker-compose logs"
    echo "🔄 You can try restarting with: docker-compose restart"
fi