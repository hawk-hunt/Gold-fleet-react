#!/bin/bash

# Gold Fleet Project Setup Script
# Configures both backend Laravel and frontend React environments

set -e

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "=========================================="
echo "Gold Fleet Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."
command -v php &> /dev/null || { print_error "PHP is not installed"; exit 1; }
command -v composer &> /dev/null || { print_error "Composer is not installed"; exit 1; }
command -v node &> /dev/null || { print_error "Node.js is not installed"; exit 1; }
command -v npm &> /dev/null || { print_error "npm is not installed"; exit 1; }
print_step "✓ All prerequisites installed"
echo ""

# Backend Setup
print_step "========== BACKEND SETUP (Laravel) =========="
cd "$BACKEND_DIR"

if [ ! -f "composer.lock" ]; then
    print_step "Installing Composer dependencies..."
    composer install --no-interaction
else
    print_step "Composer dependencies already installed"
fi

if [ ! -f ".env" ]; then
    print_step "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
else
    print_step ".env file already exists"
fi

print_step "Running migrations..."
php artisan migrate --force || print_warning "Migrations may already be applied"

print_step "✓ Backend setup complete"
echo ""

# Frontend Setup
print_step "========== FRONTEND SETUP (React) =========="
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    print_step "Installing npm dependencies..."
    npm install
else
    print_step "npm dependencies already installed"
fi

print_step "✓ Frontend setup complete"
echo ""

# Summary
print_step "========== SETUP COMPLETE =========="
echo ""
echo "To start the application:"
echo ""
echo "  Backend (Laravel):"
echo "    cd $BACKEND_DIR"
echo "    php artisan serve"
echo "    Runs on: http://localhost:8000"
echo ""
echo "  Frontend (React):"
echo "    cd $FRONTEND_DIR"
echo "    npm run dev"
echo "    Runs on: http://localhost:5173"
echo ""
print_warning "Make sure both servers are running!"
echo ""
echo "Documentation:"
echo "  - README.md                 - Project overview and setup"
echo "  - IMPLEMENTATION_GUIDE.md   - Component patterns and guide"
echo "  - MIGRATION_CHECKLIST.md    - Blade to React migration steps"
echo ""
