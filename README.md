# Document Management Dashboard

A full-stack document management application built with React + Vite, Node.js + Express, and MongoDB. Upload PDF documents, track progress in real-time, and receive notifications for bulk uploads.

## Features

✅ **File Upload — Individual & Bulk**
- Single and multi-file PDF upload support
- Real-time progress bars for each file
- Drag and drop interface
- File size and type validation

✅ **Smart Notifications for Bulk Uploads**
- Background processing for 3+ files
- Toast notifications with progress updates
- Real-time WebSocket notifications
- Persistent notification storage

✅ **Notification Center**
- Persistent notification panel with unread badge
- Mark individual/all notifications as read
- Real-time updates via WebSocket
- Timestamp and notification type indicators

✅ **Dark Mode**
- Toggle between light and dark themes
- Persisted theme preference
- Smooth transitions

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express
- MongoDB
- WebSocket (ws)

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or update connection string in .env)

### Backend Setup

```bash
cd backend
npm install
```

Create/Update `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/document-management
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
UPLOAD_DIR=./uploads
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

### Upload
- `POST /api/upload/bulk` - Upload multiple files
- `POST /api/upload/single` - Upload single file
- `GET /api/upload` - Get all documents
- `GET /api/upload/download/:filename` - Download file
- `DELETE /api/upload/:id` - Delete document

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read/all` - Mark all as read
- `POST /api/notifications` - Create notification

## Database Schema

### Document
```javascript
{
  filename: String,
  originalname: String,
  size: Number,
  mimeType: String,
  path: String,
  uploadDate: Date,
  status: String, // 'pending', 'uploading', 'complete', 'failed'
  batchId: String,
  downloadUrl: String
}
```

### Notification
```javascript
{
  message: String,
  type: String, // 'success', 'error', 'info'
  timestamp: Date,
  read: Boolean,
  batchId: String,
  fileCount: Number
}
```

## Features Breakdown

### 1. File Upload
- Supports drag-and-drop or file input
- Individual progress bars for each file
- Files are validated to be PDF only
- Instant feedback on upload completion

### 2. Bulk Upload Handling
- When 3+ files uploaded together:
  - Shows bulk upload banner
  - Displays background processing state
  - Sends WebSocket notification on completion
- When 3 or fewer files:
  - Shows inline progress (no notification needed)

### 3. Notification Center
- Bell icon with unread count badge
- Dropdown panel showing recent notifications
- Mark individual/all as read
- Persistent storage (not localStorage)

## Color Scheme

- **Deep Navy**: `#001f3f` / `#000d1a`
- **Indigo**: `#4338ca`
- **Violet**: `#7c3aed`
- **Cyan**: `#06b6d4`
- **Teal**: `#14b8a6`
- **Purple**: `#a855f7`

## Responsive Design

- Mobile-first approach using Tailwind CSS
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all screen sizes

## Running Tests (Optional)

Currently supports manual testing. Unit tests can be added using:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## Project Structure

```
Document Management/
├── backend/
│   ├── models/
│   │   ├── Document.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── notification.js
│   ├── middleware/
│   ├── uploads/ (created at runtime)
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FileUploadArea.jsx
    │   │   ├── FileUploadProgress.jsx
    │   │   ├── BulkUploadBanner.jsx
    │   │   ├── NotificationBell.jsx
    │   │   ├── NotificationList.jsx
    │   │   └── DocumentList.jsx
    │   ├── api/
    │   │   └── client.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── package.json
    └── .env
```

## Deployment

### Backend (example with Vercel/Render)
- Push code to GitHub
- Connect repo to Vercel/Render
- Set environment variables
- Deploy

### Frontend (example with Vercel)
- Push to GitHub
- Connect repo to Vercel
- Update VITE_API_URL to production backend
- Deploy

## Future Enhancements

- File search and filtering
- Document preview
- User authentication and authorization
- Advanced notification preferences
- File versioning
- Integration with cloud storage (AWS S3)

## License

MIT
