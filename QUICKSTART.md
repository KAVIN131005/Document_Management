# Quick Start Guide

Get the Document Management Dashboard running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Docker](https://www.docker.com/products/docker-desktop))

## 🚀 Start in 3 Steps

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Start MongoDB
```bash
# Using Docker (easiest)
docker-compose up -d mongodb

# OR use local MongoDB
mongod
```

### Step 3: Start the Application
```bash
npm run dev
```

**That's it!** 🎉

- **Frontend**: Open http://localhost:5173
- **Backend**: Running on http://localhost:5000

## ✨ What You Can Do

### Upload Files
1. Drag PDF files onto the upload area
2. Or click to select files
3. Watch real-time progress bars
4. Files appear in the list below

### Bulk Uploads (3+ files)
1. Select 4 or more PDF files at once
2. See "Upload in progress" banner
3. Get notified when complete
4. Check notification center

### Manage Notifications
1. Click the bell icon (top right)
2. See all notifications
3. Mark as read
4. Clear individual or all

### Dark Mode
1. Click sun/moon icon (top right)
2. Theme persists on reload

## 📁 Project Structure

```
├── backend/          Express + MongoDB API
├── frontend/         React + Vite + Tailwind
├── README.md         Overview
├── SETUP.md          Detailed setup
├── API.md            API documentation
├── TESTING.md        Testing checklist
└── IMPLEMENTATION.md Full technical details
```

## 🛠️ Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:backend` | Start only backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Clean build artifacts |

## 🔗 Important URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/health

## 📚 Documentation

- **[README.md](README.md)** - Full project overview
- **[SETUP.md](SETUP.md)** - Detailed installation & configuration
- **[API.md](API.md)** - Complete API reference with examples
- **[TESTING.md](TESTING.md)** - Comprehensive testing checklist
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Technical deep dive

## 🆘 Troubleshooting

### "MongoDB connection refused"
```bash
# Ensure MongoDB is running
docker-compose up -d mongodb

# Verify it's running
docker ps | grep mongodb
```

### "Port 5000/5173 already in use"
```bash
# Find process on port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process (then restart)
```

### "Frontend can't connect to backend"
1. Check backend is running (see terminal for "Server running on port 5000")
2. Verify `.env` files have correct URLs
3. Check firewall settings

### "Uploads not showing"
1. Refresh the page (F5)
2. Check browser console for errors (F12)
3. Check backend console for database errors

## 🎯 Test Features

### Single File Upload
1. Click upload area
2. Select one PDF
3. Watch progress (0-100%)
4. File appears in table

### Bulk Upload
1. Select 5 PDF files
2. See bulk banner
3. Get notification when done
4. All files appear in table

### Notifications
1. Click bell icon
2. See upload notifications
3. Mark as read
4. Refresh page - still there!

### Dark Mode
1. Click moon icon
2. Page goes dark
3. Refresh page
4. Still dark!

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Output: frontend/dist/
# Deploy to: Vercel, Netlify, AWS, etc.
```

## 🤝 Contributing

1. Make changes
2. Test locally (`npm run dev`)
3. Check documentation
4. Commit with clear message
5. Push to repository

## 📝 License

MIT - See LICENSE file

## 🎓 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios, WebSocket
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Other**: Docker, Git

## ✅ Requirements Met

- ✅ File Upload (Individual & Bulk)
- ✅ Real-time Progress Bars
- ✅ Smart Notifications (3+ files)
- ✅ Notification Center
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Clean Git History (commits every 15min)
- ✅ Full Documentation
- ✅ Production Ready

---

**Questions?** Check the documentation files or open an issue on GitHub.

**Ready to deploy?** See SETUP.md for deployment instructions.

Happy uploading! 🚀
