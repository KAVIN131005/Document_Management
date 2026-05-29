# Testing Guide

## Manual Testing Checklist

### Feature 1: File Upload - Individual & Bulk

#### 1.1 Single File Upload
- [ ] Open browser and navigate to http://localhost:5173
- [ ] Click on the upload area
- [ ] Select one PDF file
- [ ] Verify progress bar appears and shows 0-100%
- [ ] Wait for upload to complete
- [ ] Verify file appears in "Your Documents" table
- [ ] Verify file details show: filename, size, upload date
- [ ] Verify download button works (downloads file)
- [ ] Verify delete button works (removes file from list)
- [ ] Refresh page and verify file is still in the list

#### 1.2 Bulk Upload (4+ Files)
- [ ] Select 4 PDF files at once (drag or click)
- [ ] Verify all progress bars appear simultaneously
- [ ] Verify each has independent progress tracking
- [ ] Wait for all uploads to complete
- [ ] Verify all files appear in the documents table
- [ ] Verify file sizes are correct

#### 1.3 Bulk Upload (2 Files)
- [ ] Select 2 PDF files
- [ ] Verify individual progress bars show (inline)
- [ ] NO bulk upload banner should appear
- [ ] Verify no notification is created

#### 1.4 Error Handling
- [ ] Try uploading a non-PDF file (should error)
- [ ] Try uploading 0 files (should error)
- [ ] Try uploading while backend is down (should show error)

### Feature 2: Smart Notifications for Bulk Uploads

#### 2.1 Bulk Upload (3+ Files) - With Banner
- [ ] Upload 3 files simultaneously
- [ ] Verify "Upload in progress — processing 3 files in background" banner appears
- [ ] Verify banner has spinner icon
- [ ] Verify banner says "You'll receive a notification when complete"
- [ ] Keep app open and wait for notification
- [ ] Verify notification appears in notification center
- [ ] Check notification says "3 files uploaded successfully"
- [ ] Verify notification has timestamp

#### 2.2 Notification Persistence
- [ ] Upload 3+ files to trigger notification
- [ ] Note the notification message
- [ ] Refresh the page (F5)
- [ ] Verify notification is still in the notification center
- [ ] Verify it wasn't deleted
- [ ] Close app tab and reopen
- [ ] Verify notification persists

#### 2.3 WebSocket Notification (Real-time)
- [ ] Open DevTools Console (F12)
- [ ] Upload 3+ files
- [ ] Check console for "WebSocket connected" message
- [ ] Verify notification arrives within 5 seconds
- [ ] Check console for any WebSocket errors

#### 2.4 Multiple Bulk Uploads
- [ ] Upload 4 files
- [ ] Wait for notification
- [ ] Upload 3 more files
- [ ] Verify you get another notification
- [ ] Both notifications should be in notification center

### Feature 3: Notification Center

#### 3.1 Notification Bell and Badge
- [ ] Upload files to create notifications
- [ ] Look at header top right - see bell icon
- [ ] Verify red badge shows unread count (e.g., "3")
- [ ] After uploading 1 file, badge should show "1"
- [ ] After uploading 4 more files (and getting notification), badge should show "1" (only bulk upload counted)

#### 3.2 Notification Dropdown
- [ ] Click the bell icon
- [ ] Verify dropdown appears below bell
- [ ] Verify it shows list of notifications
- [ ] Verify each notification shows:
  - [ ] Icon (success = green checkmark)
  - [ ] Message text
  - [ ] Timestamp ("5m ago", "2h ago", etc.)
  - [ ] Unread indicator (blue dot on left side)
- [ ] Verify "Mark all as read" button appears in header

#### 3.3 Mark as Read
- [ ] Click on an unread notification
- [ ] Verify unread indicator (blue dot) disappears
- [ ] Verify notification background changes (no longer highlighted)
- [ ] Click "Mark all as read"
- [ ] Verify all blue dots disappear
- [ ] Verify unread badge on bell icon changes to "0" or disappears

#### 3.4 Notification Persistence
- [ ] Create notifications (upload files)
- [ ] Refresh page (F5)
- [ ] Verify notifications are still there
- [ ] Click bell icon
- [ ] Verify notifications and their read status are preserved
- [ ] Close browser tab, reopen
- [ ] Verify notifications still exist

#### 3.5 Multiple Notifications
- [ ] Upload 3 files → get notification
- [ ] Upload 4 files → get another notification
- [ ] Click bell to see both
- [ ] Verify newest notification appears at top
- [ ] Verify older notification appears below
- [ ] Verify both have correct message and timestamp

#### 3.6 Notification Dropdown Actions
- [ ] Open notification dropdown
- [ ] Click outside dropdown
- [ ] Verify dropdown closes
- [ ] Click bell again
- [ ] Verify dropdown opens again
- [ ] Verify notifications are in same order

### Feature 4: Dark Mode

#### 4.1 Toggle Dark Mode
- [ ] Click sun/moon icon in header top right
- [ ] Verify page switches to dark theme immediately
- [ ] Verify all elements have dark colors:
  - [ ] Background is dark gray/black
  - [ ] Text is light/white
  - [ ] Cards have dark background
  - [ ] Input fields have dark background
- [ ] Click again to switch back to light mode
- [ ] Verify all colors return to light theme

#### 4.2 Dark Mode Persistence
- [ ] Click to switch to dark mode
- [ ] Refresh page (F5)
- [ ] Verify page loads in dark mode
- [ ] Switch to light mode
- [ ] Refresh page
- [ ] Verify page loads in light mode

#### 4.3 Dark Mode in All Views
- [ ] Switch to dark mode
- [ ] Upload files
- [ ] Open notification dropdown
- [ ] Delete a file
- [ ] Verify dark mode applies to all views
- [ ] Check notification dropdown - should be dark
- [ ] Check document table - should be dark

### Feature 5: Document Management

#### 5.1 Download File
- [ ] Upload a file
- [ ] Click download icon next to file
- [ ] Verify file downloads to your computer
- [ ] Verify downloaded file is correct (can open it)

#### 5.2 Delete File
- [ ] Upload a file
- [ ] Click delete (trash) icon
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" - file should remain
- [ ] Click delete again
- [ ] Click confirm - file should disappear from list
- [ ] Refresh page
- [ ] Verify file is still gone

#### 5.3 File Table
- [ ] Upload 5 files
- [ ] Verify table shows all files
- [ ] Verify columns: Filename, Size, Date, Actions
- [ ] Verify files are sorted by date (newest first)
- [ ] Click filename - should be truncated if too long
- [ ] Hover over long filename - should show full name

### Feature 6: UI/UX

#### 6.1 Upload Area
- [ ] Verify upload area is centered and visible
- [ ] Drag file over upload area
- [ ] Verify visual feedback (hover effect)
- [ ] Verify upload area has dashed border
- [ ] Verify cloud icon and text are visible

#### 6.2 Progress Indicators
- [ ] Upload a file
- [ ] Verify progress bar appears
- [ ] Verify progress bar fills from left to right
- [ ] Verify percentage shown (e.g., "45%")
- [ ] Verify progress is smooth (not jumpy)

#### 6.3 Loading States
- [ ] Upload files
- [ ] While uploading, verify:
  - [ ] Progress bars are visible
  - [ ] Upload area is disabled
  - [ ] Can't start another upload
- [ ] After upload, verify loading state clears

#### 6.4 Responsive Design
- [ ] Resize browser window (desktop)
- [ ] Verify layout adjusts properly
- [ ] Verify no horizontal scrolling
- [ ] Open on tablet/mobile (if possible)
- [ ] Verify layout is responsive
- [ ] Verify buttons are clickable on mobile

#### 6.5 Color Scheme
- [ ] Verify indigo/violet gradient is used
- [ ] Verify buttons use indigo color
- [ ] Verify cyan glow effects work
- [ ] Verify colors match design specs

### Feature 7: Error Handling

#### 7.1 Backend Down
- [ ] Stop backend server
- [ ] Try uploading file
- [ ] Verify error message appears
- [ ] Verify error is user-friendly
- [ ] Start backend again
- [ ] Verify uploads work again

#### 7.2 Invalid Files
- [ ] Try uploading .txt file
- [ ] Verify error: "Only PDF files are allowed"
- [ ] Try uploading .jpg image
- [ ] Verify same error
- [ ] Try uploading valid PDF
- [ ] Verify it works

#### 7.3 Database Error
- [ ] Stop MongoDB
- [ ] Try uploading file
- [ ] Verify backend shows error in console
- [ ] Start MongoDB
- [ ] Verify uploads work again

### Feature 8: Performance

#### 8.1 Large File Upload
- [ ] Create/find a large PDF (5+ MB)
- [ ] Upload it
- [ ] Verify progress bar works smoothly
- [ ] Verify doesn't crash
- [ ] Verify file downloads correctly

#### 8.2 Multiple Concurrent Uploads
- [ ] Upload 5 files rapidly
- [ ] Verify all progress together
- [ ] Verify no errors
- [ ] Verify all files upload successfully

#### 8.3 WebSocket Stability
- [ ] Keep app open for 5+ minutes
- [ ] Upload files periodically
- [ ] Watch DevTools Console for errors
- [ ] Verify no memory leaks
- [ ] Verify notifications still arrive

## Automated Testing (Optional)

### Frontend Component Tests

Run with: `npm test` in frontend folder

```javascript
// Test FileUploadArea
- renders upload area
- displays file input
- handles drag and drop
- shows progress on upload
- displays error on failed upload
- handles multiple file selection

// Test NotificationBell
- renders bell icon
- shows unread count badge
- opens dropdown on click
- closes dropdown on click outside
- marks notification as read
- marks all notifications as read
- displays all notifications

// Test DocumentList
- renders table
- fetches and displays documents
- allows download
- allows delete
- shows loading state
- handles empty state

// Test BulkUploadBanner
- shows for 3+ files
- displays file count
- shows spinner
- displays user message
```

### Backend API Tests

Run with: `npm test` in backend folder

```javascript
// POST /api/upload/single
- accepts PDF file
- rejects non-PDF files
- saves to database
- returns correct response

// POST /api/upload/bulk
- accepts multiple PDF files
- creates notification for 3+ files
- saves all documents
- returns batchId

// GET /api/upload
- returns all documents
- returns correct schema
- sorted by date

// GET /api/notifications
- returns all notifications
- persists across requests

// PATCH /api/notifications/:id/read
- marks notification as read
- returns updated notification

// PATCH /api/notifications/read/all
- marks all as read
- returns success
```

## Browser Compatibility

Test in these browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Accessibility Testing

- [ ] Tab through interface - all elements accessible
- [ ] Test with screen reader (if possible)
- [ ] Verify color contrast (light/dark mode)
- [ ] Test keyboard navigation
- [ ] Verify form labels present

## Security Testing

- [ ] Try uploading executable (.exe)
  - Verify rejected (only PDF)
- [ ] Try very large file
  - Verify handled gracefully
- [ ] Try uploading 1000 files at once
  - Verify limited to 50 per request
- [ ] Check API doesn't expose sensitive info
  - Verify no password/key in response

## Stress Testing

- [ ] Upload 100+ files over time
- [ ] Create 1000+ notifications
- [ ] Check database doesn't get too large
- [ ] Monitor memory usage
- [ ] Verify no performance degradation

## Network Testing

- [ ] Test on 3G/4G connection (if possible)
  - Use Chrome DevTools throttling
- [ ] Verify uploads work on slow connection
- [ ] Verify timeout handling
- [ ] Verify reconnection after network failure
