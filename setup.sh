#!/bin/bash

echo "🚀 Setting up BlogWeb - Modern Blogging Platform"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB and make sure it's running."
    echo "   Download from: https://www.mongodb.com/try/download/community"
fi

echo "📦 Installing Backend Dependencies..."
cd backend
npm install

echo "🔧 Setting up Backend Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update the .env file with your actual configuration"
else
    echo "✅ .env file already exists"
fi

echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB service on your system"
echo "3. Run the following commands in separate terminals:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🎊 Happy Blogging!"