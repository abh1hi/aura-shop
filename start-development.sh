#!/bin/bash

# Aura Shop Development Startup Script
# This script starts both frontend and backend servers with proper configuration

set -e  # Exit on any error

echo "🚀 Starting Aura Shop Development Environment..."
echo "=====================================\n"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo -e "${RED}Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to check if MongoDB is running
check_mongodb() {
    if ! pgrep -x "mongod" > /dev/null; then
        echo -e "${YELLOW}MongoDB is not running. Please start MongoDB first:${NC}"
        echo "  - macOS: brew services start mongodb-community"
        echo "  - Linux: sudo systemctl start mongod"
        echo "  - Windows: net start MongoDB"
        echo "  - Or use MongoDB Atlas connection string in .env"
        return 1
    fi
    echo -e "${GREEN}✓ MongoDB is running${NC}"
    return 0
}

# Function to setup backend
setup_backend() {
    echo -e "${BLUE}Setting up backend...${NC}"
    
    cd metainflu/backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file from template...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
    fi
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Check port availability
    if ! check_port 5000; then
        echo -e "${RED}Backend port 5000 is busy. Please free the port or change PORT in .env${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Backend setup complete${NC}"
    cd ../..
}

# Function to setup frontend
setup_frontend() {
    echo -e "${BLUE}Setting up frontend...${NC}"
    
    cd metainflu/adminpanel/frontend/admin-new-ui
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        echo -e "${YELLOW}Creating frontend .env.local file...${NC}"
        cp .env.example .env.local
    fi
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Check port availability
    if ! check_port 5174; then
        echo -e "${RED}Frontend port 5174 is busy. The dev server will find another port.${NC}"
    fi
    
    echo -e "${GREEN}✓ Frontend setup complete${NC}"
    cd ../../../..
}

# Main execution
main() {
    # Check prerequisites
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 18+${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
    
    # Check MongoDB (optional for development)
    check_mongodb || echo -e "${YELLOW}You can also use MongoDB Atlas instead of local MongoDB${NC}"
    
    # Setup components
    setup_backend
    setup_frontend
    
    echo -e "\n${GREEN}✓ Setup complete!${NC}"
    echo -e "${BLUE}Starting development servers...${NC}\n"
    
    # Start both servers using npm scripts in the background
    echo -e "${YELLOW}Starting backend server...${NC}"
    cd metainflu/backend
    npm run dev &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 3
    
    echo -e "${YELLOW}Starting frontend server...${NC}"
    cd ../adminpanel/frontend/admin-new-ui
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for servers to fully start
    sleep 5
    
    # Display URLs
    echo -e "\n${GREEN}\u2705 Both servers are starting...${NC}"
    echo -e "${BLUE}\u276f Backend API: http://localhost:5000${NC}"
    echo -e "${BLUE}\u276f Admin Panel: http://localhost:5174${NC}"
    echo -e "${BLUE}\u276f API Health: http://localhost:5000/health${NC}"
    echo -e "${BLUE}\u276f API Info: http://localhost:5000/api/info${NC}"
    
    echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}"
    
    # Function to cleanup on exit
    cleanup() {
        echo -e "\n${YELLOW}Stopping servers...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}Servers stopped. Goodbye!${NC}"
        exit 0
    }
    
    # Trap Ctrl+C
    trap cleanup INT
    
    # Wait for user to stop
    wait
}

# Run main function
main