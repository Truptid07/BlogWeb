# MongoDB Atlas Setup Fix Guide

## Current Issue
Authentication failed with your MongoDB Atlas connection string. This usually means:
1. **Wrong username/password** in the connection string
2. **Database user not created** in MongoDB Atlas
3. **IP address not whitelisted** in MongoDB Atlas

## Fix Steps

### Step 1: Check Your MongoDB Atlas Dashboard
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Select your project and cluster

### Step 2: Create/Verify Database User
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Create user with:
   - **Username**: `bloguser` (or your preferred username)
   - **Password**: `blogpass123` (or your preferred password)
   - **Database User Privileges**: **Read and write to any database**

### Step 3: Whitelist IP Address
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Add **0.0.0.0/0** (Allow access from anywhere) - for development
   - For production, add specific IPs

### Step 4: Get Correct Connection String
1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your actual credentials

### Step 5: Update Your Connection String
Your corrected connection string should look like:
```
mongodb+srv://bloguser:blogpass123@cluster0.emi78dg.mongodb.net/blogplatform?retryWrites=true&w=majority&appName=Cluster0
```

### Step 6: Test Locally
Update your `.env` file with the correct connection string and test:
```bash
cd backend
node seedDatabase.js
```

## Common Connection String Formats

**Replace these placeholders:**
- `<username>` → Your MongoDB Atlas username
- `<password>` → Your MongoDB Atlas password  
- `<cluster-url>` → Your cluster URL (cluster0.emi78dg.mongodb.net)
- `<database>` → Your database name (blogplatform)

**Final format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.emi78dg.mongodb.net/blogplatform?retryWrites=true&w=majority&appName=Cluster0
```

## Next Steps After Fix
1. Test database connection locally
2. Update deployment files with correct connection string
3. Deploy to Render with working MongoDB Atlas connection

## Alternative: Use Render's MongoDB
If MongoDB Atlas continues to have issues, you can:
1. Create a MongoDB service on Render (free tier)
2. Use Render's internal connection string
3. This eliminates authentication issues