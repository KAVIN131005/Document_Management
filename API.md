# API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-api-domain.com`

All endpoints are prefixed with `/api`

## Authentication

Currently, the API does not require authentication (single-user prototype). JWT setup is configured in the backend but not enforced on routes.

## Upload Endpoints

### Upload Multiple Files

**Endpoint**: `POST /api/upload/bulk`

**Content-Type**: `multipart/form-data`

**Parameters**:
- `files` (required): Array of PDF files (max 50 files)

**Request**:
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
// ... more files

fetch('http://localhost:5000/api/upload/bulk', {
  method: 'POST',
  body: formData
})
```

**Response (Success)**:
```json
{
  "success": true,
  "batchId": "uuid-string",
  "fileCount": 4,
  "isBulk": true,
  "files": [
    {
      "_id": "mongo-id",
      "filename": "1234567890-123456789.pdf",
      "originalname": "document.pdf",
      "size": 1024000,
      "mimeType": "application/pdf",
      "path": "./uploads/1234567890-123456789.pdf",
      "uploadDate": "2024-01-15T10:30:00Z",
      "status": "complete",
      "batchId": "uuid-string",
      "downloadUrl": "/api/upload/download/1234567890-123456789.pdf"
    }
  ]
}
```

**Response (Error)**:
```json
{
  "error": "Upload failed",
  "message": "Only PDF files are allowed"
}
```

### Upload Single File

**Endpoint**: `POST /api/upload/single`

**Content-Type**: `multipart/form-data`

**Parameters**:
- `file` (required): Single PDF file

**Response**: Same structure as bulk upload (with `isBulk: false`)

### Get All Documents

**Endpoint**: `GET /api/upload`

**Method**: GET

**Response**:
```json
[
  {
    "_id": "mongo-id",
    "filename": "1234567890-123456789.pdf",
    "originalname": "document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "status": "complete",
    "downloadUrl": "/api/upload/download/1234567890-123456789.pdf"
  }
]
```

### Download File

**Endpoint**: `GET /api/upload/download/:filename`

**Parameters**:
- `filename` (required): The filename to download

**Response**: Binary file stream

**Usage**:
```javascript
// Direct link
<a href="http://localhost:5000/api/upload/download/filename.pdf">Download</a>

// Using Fetch API
fetch('http://localhost:5000/api/upload/download/filename.pdf')
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filename.pdf';
    a.click();
  });
```

### Delete Document

**Endpoint**: `DELETE /api/upload/:id`

**Parameters**:
- `id` (required): MongoDB document ID

**Response**:
```json
{
  "success": true,
  "message": "Document deleted"
}
```

**Error Response**:
```json
{
  "error": "Document not found"
}
```

## Notification Endpoints

### Get All Notifications

**Endpoint**: `GET /api/notifications`

**Response**:
```json
[
  {
    "_id": "mongo-id",
    "message": "4 files uploaded successfully",
    "type": "success",
    "timestamp": "2024-01-15T10:30:00Z",
    "read": false,
    "batchId": "uuid-string",
    "fileCount": 4
  }
]
```

### Get Unread Count

**Endpoint**: `GET /api/notifications/unread/count`

**Response**:
```json
{
  "unreadCount": 3
}
```

### Mark Notification as Read

**Endpoint**: `PATCH /api/notifications/:id/read`

**Parameters**:
- `id` (required): Notification MongoDB ID

**Response**:
```json
{
  "_id": "mongo-id",
  "message": "4 files uploaded successfully",
  "type": "success",
  "timestamp": "2024-01-15T10:30:00Z",
  "read": true,
  "batchId": "uuid-string",
  "fileCount": 4
}
```

### Mark All Notifications as Read

**Endpoint**: `PATCH /api/notifications/read/all`

**Response**:
```json
{
  "success": true
}
```

### Create Notification (Admin/Testing)

**Endpoint**: `POST /api/notifications`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "message": "Custom notification message",
  "type": "success",
  "fileCount": 5
}
```

**Response**:
```json
{
  "_id": "mongo-id",
  "message": "Custom notification message",
  "type": "success",
  "timestamp": "2024-01-15T10:30:00Z",
  "read": false,
  "fileCount": 5
}
```

### Delete Notification

**Endpoint**: `DELETE /api/notifications/:id`

**Parameters**:
- `id` (required): Notification MongoDB ID

**Response**:
```json
{
  "success": true
}
```

## WebSocket Events

### Connection

**URL**: `ws://localhost:5000`

```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};
```

### Receiving Notifications

**Event**: `message`

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'notification') {
    console.log('New notification:', message.data);
  }
};
```

**Message Format**:
```json
{
  "type": "notification",
  "data": {
    "_id": "mongo-id",
    "message": "4 files uploaded successfully",
    "type": "success",
    "timestamp": "2024-01-15T10:30:00Z",
    "read": false,
    "fileCount": 4
  }
}
```

### Handling Disconnection

```javascript
ws.onclose = () => {
  console.log('WebSocket disconnected');
  // Auto-reconnect logic is handled in frontend
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

## Error Handling

### Standard Error Response

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

### Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "No files uploaded" | POST request without files |
| 400 | "Only PDF files are allowed" | Non-PDF file uploaded |
| 404 | "File not found" | Download non-existent file |
| 404 | "Document not found" | Delete non-existent document |
| 404 | "Notification not found" | Access non-existent notification |
| 500 | "Upload failed" | Server error during upload |
| 500 | "Failed to fetch documents" | Database connection error |

## Rate Limiting

Currently no rate limiting is enforced. For production, consider implementing:
- Max 100 requests per minute per IP
- Max file size: 50MB
- Max 50 files per request

## Testing with cURL

### Upload a file
```bash
curl -X POST http://localhost:5000/api/upload/single \
  -F "file=@document.pdf"
```

### Get all documents
```bash
curl http://localhost:5000/api/upload
```

### Get notifications
```bash
curl http://localhost:5000/api/notifications
```

### Get unread count
```bash
curl http://localhost:5000/api/notifications/unread/count
```

### Mark as read
```bash
curl -X PATCH http://localhost:5000/api/notifications/{id}/read
```

## Testing with Postman

1. Create a new request collection
2. Set base URL to `http://localhost:5000/api`
3. Create requests for each endpoint:
   - **POST** `/upload/bulk` (form-data with files)
   - **POST** `/upload/single` (form-data with file)
   - **GET** `/upload`
   - **GET** `/upload/download/filename`
   - **DELETE** `/upload/{id}`
   - **GET** `/notifications`
   - **GET** `/notifications/unread/count`
   - **PATCH** `/notifications/{id}/read`
   - **PATCH** `/notifications/read/all`
   - **POST** `/notifications` (json body)
   - **DELETE** `/notifications/{id}`

## WebSocket Testing

Using `websocat`:
```bash
websocat ws://localhost:5000
```

## Database Schemas

### Document Collection

```javascript
{
  _id: ObjectId,
  filename: String,              // Generated filename with timestamp
  originalname: String,          // Original filename from upload
  size: Number,                  // File size in bytes
  mimeType: String,              // Always "application/pdf"
  path: String,                  // Full file path
  uploadDate: Date,              // Timestamp of upload
  status: String,                // 'pending', 'uploading', 'complete', 'failed'
  batchId: String,               // UUID for bulk uploads
  downloadUrl: String            // Relative download URL
}
```

### Notification Collection

```javascript
{
  _id: ObjectId,
  message: String,               // Notification message
  type: String,                  // 'success', 'error', 'info'
  timestamp: Date,               // When notification was created
  read: Boolean,                 // Read status
  batchId: String,               // Optional batch ID for bulk uploads
  fileCount: Number              // Number of files (for bulk uploads)
}
```

## Performance Considerations

- Large file uploads (>50MB) may timeout
- Database queries are indexed on `uploadDate` and `read` status
- WebSocket broadcasts to all connected clients
- File storage is local filesystem (consider cloud storage for production)

## Security Notes

- Files are served directly from disk
- No file validation beyond MIME type checking
- No user authentication (add before production)
- Consider implementing:
  - File scanning for viruses
  - File size limits
  - Rate limiting
  - User authentication
  - File encryption

## Version History

- v1.0.0 - Initial release
  - Basic file upload
  - Document management
  - Notification system
  - WebSocket notifications
