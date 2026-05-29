# MongoDB Atlas Setup Guide

Your project is now configured to use **MongoDB Atlas** (cloud MongoDB) instead of local MongoDB.

## ✅ MongoDB Atlas Connection Configured

Your backend is set to use:
```
mongodb+srv://kumarkavin2005:kavin2005@cluster0.av1uwkp.mongodb.net/?appName=Cluster0
```

## 🔧 Important Setup Steps

### 1️⃣ Whitelist Your IP Address

MongoDB Atlas requires you to whitelist your IP address:

1. Go to: https://cloud.mongodb.com/v2
2. Log in with your account
3. Select your **Cluster0** cluster
4. Click **Network Access** (left sidebar)
5. Click **Add IP Address**
6. Click **Add Current IP Address**
   - OR manually enter your IP: https://www.whatismyip.com/
7. Wait 1-2 minutes for it to be added

### 2️⃣ Verify Database User Exists

1. In MongoDB Atlas, go to **Database Access** (left sidebar)
2. Look for user: `kumarkavin2005`
3. If it doesn't exist, create it:
   - Click **Add Database User**
   - Username: `kumarkavin2005`
   - Password: `kavin2005`
   - Select **Database User** role
   - Click **Add User**

### 3️⃣ Enable Network Access

1. Go to **Network Access** in MongoDB Atlas
2. Make sure your IP is whitelisted (from Step 1)
3. Alternatively, add `0.0.0.0/0` to allow all IPs (⚠️ less secure)

## 🚀 Run the Application

After completing the above steps:

```bash
# 1. No need for Docker MongoDB anymore!
# Just start the backend and frontend

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

## ✅ Verify Connection

When the backend starts, you should see:
```
Server running on port 5000
MongoDB connected
```

If you see "MongoDB connection error", check:
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] Database user credentials are correct
- [ ] Network access is enabled
- [ ] You have internet connection

## 📝 Connection Details

| Setting | Value |
|---------|-------|
| **Database** | Cluster0 |
| **User** | kumarkavin2005 |
| **Host** | cluster0.av1uwkp.mongodb.net |
| **Application** | Document Management Dashboard |

## 🗄️ Collections Created Automatically

The first time you upload a file, these collections are created:
- `documents` - Stores file metadata
- `notifications` - Stores notifications

## 🔒 Important Security Notes

⚠️ **Your credentials are now in `.env`**

For production:
1. Use environment variables
2. Never commit `.env` to Git
3. Rotate credentials periodically
4. Use strong passwords
5. Limit IP access (whitelist specific IPs)

## 🆘 Troubleshooting

### "MongoDB connection error"

**Check these:**
```
1. Is your current IP whitelisted in MongoDB Atlas?
   → Add your IP at Network Access

2. Is the database user correct?
   → Check Database Access for kumarkavin2005

3. Is the password correct?
   → Verify in Connection String

4. Can you access the internet?
   → Check your network connection

5. Try restarting the backend
   → Stop npm and run again
```

### "Connection timeout"

This usually means:
- Your IP is not whitelisted
- MongoDB Atlas is still processing the IP whitelist
- Network/firewall is blocking the connection

**Solution**: Wait 2-3 minutes after adding your IP, then restart the server.

### "Invalid credentials"

This means:
- Username or password is wrong
- Database user doesn't exist

**Solution**: Check your MongoDB Atlas Database Access settings

## 📚 Useful Links

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Connection Guide**: https://docs.mongodb.com/atlas/connect/
- **IP Whitelist**: https://docs.mongodb.com/atlas/security/add-ip-address-to-list/
- **Database Users**: https://docs.mongodb.com/atlas/security-add-mongodb-users/

## 🎯 Next Steps

1. ✅ Whitelist your IP (required!)
2. ✅ Verify database user exists
3. ✅ Run `npm run dev`
4. ✅ Open http://localhost:5173
5. ✅ Upload your first file!

## ℹ️ Local Development Alternative

If you want to use local MongoDB instead:

1. Update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/document-management
```

2. Start MongoDB:
```bash
# Use Docker
docker-compose up -d mongodb

# OR local MongoDB
mongod
```

3. Run the application:
```bash
npm run dev
```

---

**Everything is ready to go!** Once you whitelist your IP in MongoDB Atlas, the application will work perfectly with cloud storage. 🎉
