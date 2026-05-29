#!/bin/bash

echo "Starting Document Management Dashboard..."

# Check if MongoDB is running
echo "Checking MongoDB connection..."
mongosh "mongodb://localhost:27017" --eval "db.adminCommand('ping')" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB is not running"
    echo "Please start MongoDB with: docker-compose up -d mongodb"
    exit 1
fi

# Start backend
echo ""
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo ""
echo "Starting frontend dev server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ Application started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"

wait
