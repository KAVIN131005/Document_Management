# 🏗️ Architecture Explanation: Storage, WebSocket & Notifications

## 📦 Where Everything is Stored

### 1. MongoDB Database Storage (Cloud - MongoDB Atlas)

**Location:** `mongodb+srv://kumarkavin2005:kavin2005@cluster0.av1uwkp.mongodb.net/document-management`

**What's stored in MongoDB:**

#### Collection 1: `documents`
```javascript
{
  _id: ObjectId("..."),
  filename: "1234567890-123456789.pdf",        // Generated unique name
  originalname: "contract.pdf",                 // Original name
  size: 1024000,                               // File size in bytes
  mimeType: "application/pdf",                 // Always PDF
  path: "./uploads/1234567890-123456789.pdf", // Server path
  uploadDate: ISODate("2024-01-15T10:30:00Z"), // Timestamp
  status: "complete",                          // Upload status
  batchId: "uuid-string",                      // Batch upload ID
  downloadUrl: "/api/upload/download/..."     // Download link
}
```

#### Collection 2: `notifications`
```javascript
{
  _id: ObjectId("..."),
  message: "5 files uploaded successfully",    // Notification text
  type: "success",                             // Type: success/error/info
  timestamp: ISODate("2024-01-15T10:32:00Z"),  // When created
  read: false,                                 // Read status (true/false)
  batchId: "uuid-string",                      // Which batch
  fileCount: 5                                 // How many files
}
```

**Data Stored in MongoDB Atlas Cloud:**
- ✅ File metadata (NOT the actual file content)
- ✅ All notifications
- ✅ Persists forever until deleted

---

### 2. File Storage (Local Server Disk)

**Location:** `backend/uploads/` folder on your computer

**What's stored:**
- Actual PDF files uploaded by users
- Named with timestamp + random number
- Example: `1705316400000-987654321.pdf`

**File Structure:**
```
backend/
├── uploads/
│   ├── 1705316400000-987654321.pdf   ← Actual PDF file 1
│   ├── 1705316401000-987654322.pdf   ← Actual PDF file 2
│   └── 1705316402000-987654323.pdf   ← Actual PDF file 3
│
└── server.js
```

**Why separate storage?**
- MongoDB is for metadata (fast queries)
- Disk is for actual files (efficient storage)

---

## 👥 Multi-User: Will Files Be Visible to All Users?

### Current Setup: Single-User (Prototype)

```javascript
// NO authentication required
// Currently: ANYONE can see EVERYTHING
```

**Current behavior:**
```
User A uploads file → Visible to User B
User B uploads file → Visible to User A
User A deletes file → User B sees it deleted
Notifications → ALL users see them
```

**Important:** This is a **prototype** - NOT secure for production!

---

## 🔐 To Make It Multi-User (Production Ready)

### Add User Authentication

```javascript
// This is what you need to add for production:

// 1. User Schema in MongoDB
{
  _id: ObjectId("..."),
  username: "john@example.com",
  password: "hashed_password",
  createdAt: ISODate("...")
}

// 2. Add userId to documents
{
  _id: ObjectId("..."),
  userId: ObjectId("user-id"),  // ← Link to user
  filename: "contract.pdf",
  originalname: "contract.pdf",
  // ... other fields
}

// 3. Add userId to notifications
{
  _id: ObjectId("..."),
  userId: ObjectId("user-id"),  // ← Link to user
  message: "5 files uploaded successfully",
  // ... other fields
}

// 4. Filter queries by user
router.get('/upload', authenticateUser, async (req, res) => {
  const documents = await Document.find({ 
    userId: req.user._id  // ← Only this user's files
  });
  res.json(documents);
});
```

### Current vs. Production

| Aspect | Current (Prototype) | Production |
|--------|-------------------|-----------|
| **Files Visibility** | All users see all files | Only own files visible |
| **Authentication** | None required | Login required |
| **Notifications** | All users see all | Only personal notifications |
| **Database Queries** | No filtering | Filtered by userId |
| **Security** | Not secure | Secure with JWT |

---

## 🔗 WebSocket: Why Use It?

### What is WebSocket?

**WebSocket** is a persistent, two-way communication channel between client and server.

```
Traditional HTTP (OLD):
Client → Request → Server
         ← Response ←

WebSocket (NEW):
Client ↔ Connection ↔ Server
         (stays open)
```

### Why WebSocket for Notifications?

#### Option 1: Polling (Without WebSocket) ❌
```javascript
// Frontend constantly asks: "Any new notifications?"
setInterval(async () => {
  const response = await fetch('/api/notifications');
  setNotifications(response.data);
}, 5000);  // Every 5 seconds

// Problems:
// - Uses lots of bandwidth
// - Battery drain on mobile
// - Delay (up to 5 seconds)
// - Server gets hammered
```

#### Option 2: WebSocket (What We Use) ✅
```javascript
// Connection established once, stays open
const ws = new WebSocket('ws://localhost:5000');

// Server pushes notification immediately
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  setNotifications(prev => [notification, ...prev]);
};

// Benefits:
// - Real-time (instant)
// - Low bandwidth
// - Server-initiated
// - One connection per client
```

### WebSocket Flow in Our App

```
1. Frontend loads
   ↓
2. Creates WebSocket connection
   ws = new WebSocket('ws://localhost:5000')
   ↓
3. User uploads 4+ files
   ↓
4. Backend saves to MongoDB
   ↓
5. Backend creates notification
   ↓
6. Backend broadcasts via WebSocket
   wss.clients.forEach(client => {
     client.send(JSON.stringify({
       type: 'notification',
       data: notification
     }));
   });
   ↓
7. Frontend receives instantly
   ws.onmessage = (event) => {
     const msg = JSON.parse(event.data);
     // Add notification to state
   }
   ↓
8. UI updates in real-time
   Bell icon badge increases
   New notification appears
   (No page refresh needed!)
```

---

## 🔔 Notification System Deep Dive

### How Notifications Work

#### Step 1: Upload Triggers Notification

```javascript
// In backend/routes/upload.js

router.post('/bulk', upload.array('files', 50), async (req, res) => {
  const files = req.files || [];
  const fileCount = files.length;

  // Save files to database and disk
  const documents = await Promise.all(...);

  // If 4+ files, create notification
  if (fileCount > 3) {
    const notification = await Notification.create({
      message: `${fileCount} files uploaded successfully`,
      type: 'success',
      fileCount,
      batchId,
    });

    // Broadcast to all connected clients
    broadcastNotification(notification);
  }

  res.json({ success: true, ... });
});
```

#### Step 2: Server Broadcasts

```javascript
const broadcastNotification = (notification) => {
  if (global.wss) {  // wss = WebSocket Server
    global.wss.clients.forEach((client) => {
      if (client.readyState === 1) {  // 1 = OPEN
        client.send(JSON.stringify({
          type: 'notification',
          data: notification,  // Send to client
        }));
      }
    });
  }
};
```

#### Step 3: Frontend Receives

```javascript
// In frontend/src/App.jsx

const connectWebSocket = () => {
  const ws = new WebSocket('ws://localhost:5000');

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    // Add to notifications array
    if (message.type === 'notification') {
      setNotifications(prev => [
        message.data,  // New notification at top
        ...prev        // Existing notifications
      ]);
    }
  };

  ws.onclose = () => {
    // Reconnect automatically
    setTimeout(() => connectWebSocket(), 5000);
  };
};
```

#### Step 4: UI Updates

```javascript
// Bell icon updates automatically
const unreadCount = notifications.filter(n => !n.read).length;
// Shows "5" if 5 unread notifications

// New notification appears in dropdown instantly
// No refresh needed!
```

---

## 📊 Data Flow Diagram

### Single File Upload
```
User selects PDF
    ↓
Frontend sends: POST /api/upload/single
    ↓
Backend saves to:
  - MongoDB (metadata)
  - Disk (actual file)
    ↓
Returns to Frontend
    ↓
UI updates: File appears in table
    ↓
NO notification (only 1 file)
```

### Bulk Upload (4+ Files)
```
User selects 5 PDFs
    ↓
Frontend shows banner: "Processing 5 files in background"
    ↓
Frontend sends: POST /api/upload/bulk
    ↓
Backend saves all 5 to:
  - MongoDB (metadata for each)
  - Disk (5 actual files)
    ↓
Backend creates Notification
    ↓
Backend broadcasts via WebSocket
    ↓
Frontend receives (via WebSocket)
    ↓
UI updates instantly:
  - Bell badge: "1"
  - Dropdown shows notification
  - Banner disappears
    ↓
User clicks bell → Sees notification
User marks as read → Database updates
User refreshes → Notification still there (from MongoDB)
```

---

## 💾 Storage Summary

### MongoDB (Cloud)
```
What: Metadata + Notifications
Where: MongoDB Atlas cloud
Persistence: Forever (until deleted)
Access: Via Node.js + Mongoose
Speed: Fast queries
```

### Local Disk
```
What: Actual PDF files
Where: backend/uploads/ folder
Persistence: Until deleted
Access: Via file system
Speed: Medium
```

### Browser Storage
```
What: Dark mode preference only
Where: localStorage
Persistence: Until cleared
Access: localStorage.getItem()
```

---

## 🔄 Real-Time Communication

### What Happens in Real-Time

#### Scenario: You and a Colleague Both Using App

**Current (Prototype - No User Auth):**
```
You:      Upload 4 files
          ↓
Backend:  Create notification
          ↓ (WebSocket broadcast)
Colleague's browser: Gets notification instantly!
          ↓
Colleague sees: "4 files uploaded successfully"

Note: Colleague doesn't know who uploaded!
```

**Production (With User Auth):**
```
You:      Upload 4 files
          ↓
Backend:  Create notification for YOUR user ID
          ↓
Server:   Only sends to YOUR WebSocket clients
          ↓
You see:  "You uploaded 4 files"
Colleague: Doesn't see anything
          ↓
Colleague: Sees only their own notifications
```

---

## 🔐 Security Considerations

### Current (NOT SECURE - Prototype):
- ❌ No authentication
- ❌ Everyone sees everything
- ❌ Anyone can delete any file
- ❌ No user isolation

### Production (Recommended):
- ✅ JWT authentication
- ✅ Only show own files
- ✅ Can't delete others' files
- ✅ Complete user isolation
- ✅ Encrypted file storage

### To Make Secure:
```bash
# Install authentication packages
npm install jsonwebtoken bcryptjs
npm install passport passport-local

# Add middleware to check userId
# Filter all queries by req.user._id
# Only serve files to file owner
```

---

## 📈 MongoDB Storage Example

### After Uploading 3 Files + 1 Bulk Upload

**MongoDB `documents` collection:**
```
Document 1: single_file.pdf (User A)
Document 2: another_file.pdf (User A)
Document 3: three_more_1.pdf (User A)
Document 4: three_more_2.pdf (User A)
Document 5: three_more_3.pdf (User A)
```

**MongoDB `notifications` collection:**
```
Notification 1: "3 files uploaded successfully"
                (from bulk upload of 3 files)
                batchId: uuid-123

Notification 2: "No notification"
                (only 1 file uploaded)

Notification 3: "3 files uploaded successfully"
                (from bulk upload of 3 files)
                batchId: uuid-456
```

---

## 🎯 Key Takeaways

### Storage:
- **MongoDB**: Metadata + notifications (cloud)
- **Disk**: Actual PDF files (your server)
- **localStorage**: Only dark mode preference

### WebSocket:
- Real-time, persistent connection
- Instant notifications (no polling)
- Efficient bandwidth usage
- Perfect for collaborative apps

### Notifications:
- Triggered by 4+ file bulk uploads
- Broadcast via WebSocket
- Stored in MongoDB
- Persist forever until deleted
- Show unread count badge

### Multi-User:
- Currently: Prototype (all files visible)
- Production: Add JWT + filter by userId
- Each user sees only their own data

---

## 🔧 To Test WebSocket Connection

```javascript
// Open browser DevTools (F12)
// Go to Console tab
// Type:

ws = new WebSocket('ws://localhost:5000');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.send('test');

// Then upload 4+ files
// Console should log the notification!
```

---

## 📞 To Make It Multi-User (Next Steps)

1. **Add User Model** (MongoDB)
2. **Add Login Page** (React)
3. **Add JWT Tokens** (Authentication)
4. **Filter Queries by userId** (Backend routes)
5. **Add User ID to WebSocket** (Selective broadcast)
6. **Update UI** (Show username)

Would you like me to implement multi-user authentication?
