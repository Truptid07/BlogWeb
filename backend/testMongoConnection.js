const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB Atlas connection
async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Test database operations
    console.log('🔄 Testing database operations...');
    
    // Create a simple test collection
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: Date
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // Insert test data
    const testDoc = new TestModel({
      name: 'Connection Test',
      timestamp: new Date()
    });
    
    await testDoc.save();
    console.log('✅ Test document inserted successfully!');
    
    // Read test data
    const docs = await TestModel.find();
    console.log(`✅ Found ${docs.length} test document(s)`);
    
    // Clean up test data
    await TestModel.deleteMany({});
    console.log('✅ Test data cleaned up');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('📋 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log('🎉 MongoDB Atlas connection test completed successfully!');
    console.log('📝 Database and collections will be created when you run the seed script.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Fix suggestions:');
      console.log('1. Check username and password in connection string');
      console.log('2. Ensure database user exists in MongoDB Atlas');
      console.log('3. Verify user has "Read and write to any database" privileges');
    }
    
    if (error.message.includes('IP not in whitelist')) {
      console.log('\n🔧 Fix suggestions:');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Add IP address 0.0.0.0/0 (allow all) for development');
    }
    
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

testConnection();