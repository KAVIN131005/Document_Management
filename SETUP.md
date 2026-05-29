# Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB 5.0+ (local installation or Docker)
- npm or yarn package manager

## Installation

### 1. Clone/Extract the project

```bash
cd Document\ Management
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Setup MongoDB

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d mongodb
```

This will start MongoDB on port 27017. Verify with:

```bash
docker ps
```

#### Option B: Local MongoDB Installation

Download and install from: https://www.mongodb.com/try/download/community

Then start the MongoDB service:
- **Windows**: `mongod`
- **Mac/Linux**: `brew services start mongodb-community`

### 4. Environment Variables

Environment files are already created:
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration

No changes needed for local development (defaults are already set).

## Running the Application

### Development Mode

#### Option 1: Using Windows Batch Script

```bash
start.bat
```

This will open two command windows:
- One for the backend server (port 5000)
- One for the frontend dev server (port 5173)

#### Option 2: Manual Terminal Commands

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v8.0.14 ready in XXXms
➜ Local: http://localhost:5173/
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## File Upload Workflow

1. **Single File Upload**: Click on the upload area or drag a PDF file
   - See real-time progress bar
   - File appears in "Your Documents" table after upload

2. **Bulk Upload (3+ files)**: 
   - Drag multiple PDF files at once
   - See "Upload in progress" banner with spinner
   - Individual progress bars still visible
   - Notification appears when all files are processed

3. **Notification Center**:
   - Click the bell icon in the header
   - See all notifications with timestamps
   - Mark as read (individual or all at once)
   - Notifications persist across page refreshes

## Testing the Features

### Test File 1: Single File Upload
1. Click on upload area
2. Select one PDF file
3. Verify progress bar shows 0-100%
4. File appears in documents list
5. Download and delete buttons work

### Test File 2: Bulk Upload (3+ files)
1. Select 4 PDF files at once (or drag)
2. Verify bulk upload banner appears
3. See all progress bars simultaneously
4. Wait for "X files uploaded successfully" notification
5. Check notification center for the message

### Test File 3: Bulk Upload (1-3 files)
1. Select 2 PDF files
2. NO banner should appear (inline progress only)
3. No notification needed (according to specs)

### Test File 4: Dark Mode
1. Click moon icon in top right
2. Page should switch to dark theme
3. Reload page - dark mode should persist
4. Click sun icon to switch back to light

### Test File 5: Notifications
1. Upload files (3+) to trigger notification
2. Click bell icon
3. See notification with "X files uploaded successfully"
4. Click "Mark all as read"
5. Refresh page - notifications should still be there

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

Output files are in `frontend/dist/`

### Deploy to Production

The `dist` folder can be served by any static file server (Vercel, Netlify, AWS S3, etc.)

For the backend, update `.env`:
```
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-secure-secret-key
```

Then deploy using:
- Vercel
- Render
- Railway
- Heroku
- AWS
- DigitalOcean

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running
```bash
# Using Docker
docker-compose up -d mongodb

# Or check if local MongoDB service is running
sudo systemctl status mongod  # Linux
brew services list            # Mac
```

### Port Already in Use

If port 5000 (backend) or 5173 (frontend) is already in use:

**Backend (port 5000)**:
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

**Frontend (port 5173)**:
```bash
# Change port in package.json or use
npm run dev -- --port 3000
```

### WebSocket Connection Failed

This usually happens when:
1. Backend server is not running
2. Backend port is incorrect
3. Firewall blocking connections

**Solution**: 
- Start backend server first
- Check `.env` for correct URLs
- Check firewall settings

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Backend already has CORS enabled. If still getting errors:
1. Ensure backend is running on port 5000
2. Check browser console for exact error
3. Verify `.env` file has correct API URL

## Project Structure

```
Document Management/
├── backend/
│   ├── models/                    # Database models
│   │   ├── Document.js            # Document schema
│   │   └── Notification.js        # Notification schema
│   ├── routes/                    # API endpoints
│   │   ├── upload.js              # File upload endpoints
│   │   └── notification.js        # Notification endpoints
│   ├── uploads/                   # Uploaded files (created at runtime)
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   ├── .env                       # Backend environment variables
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── FileUploadArea.jsx        # Upload interface
│   │   │   ├── FileUploadProgress.jsx    # Progress bars
│   │   │   ├── BulkUploadBanner.jsx      # Bulk upload notification
│   │   │   ├── NotificationBell.jsx      # Notification icon/dropdown
│   │   │   ├── NotificationList.jsx      # Notification list
│   │   │   └── DocumentList.jsx          # Documents table
│   │   ├── api/                   # API client
│   │   │   └── client.js          # Axios instance and API calls
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React DOM render
│   │   └── index.css              # Tailwind CSS + custom styles
│   ├── dist/                      # Production build output
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── vite.config.js             # Vite configuration
│   ├── package.json
│   ├── .env                       # Frontend environment variables
│   └── .env.example
│
├── README.md                      # Project overview
├── SETUP.md                       # This file
├── docker-compose.yml             # MongoDB Docker setup
├── start.bat                      # Windows startup script
├── start.sh                       # Unix startup script
└── .gitignore                     # Git ignore rules

```

## API Endpoints Reference

### Upload Endpoints
- `POST /api/upload/bulk` - Upload multiple files
- `POST /api/upload/single` - Upload single file
- `GET /api/upload` - List all documents
- `GET /api/upload/download/:filename` - Download file
- `DELETE /api/upload/:id` - Delete document

### Notification Endpoints
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark single as read
- `PATCH /api/notifications/read/all` - Mark all as read
- `POST /api/notifications` - Create notification

## Additional Notes

- All uploads are stored in `backend/uploads/` directory
- Files are served from the same endpoint: `/api/upload/download/:filename`
- WebSocket connections are established automatically on app load
- Notifications persist in MongoDB indefinitely
- Frontend uses localStorage only for dark mode preference

## Need Help?

Check the console output for detailed error messages:
- Backend: Terminal running `npm run dev` in backend folder
- Frontend: Terminal running `npm run dev` in frontend folder
- Browser: DevTools Console (F12)
