const mongoose = require('mongoose');
require('dotenv').config();

async function verifyDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Database Collections and Data:');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`  📁 ${collection.name}: ${count} documents`);
    }
    
    console.log('\n🔍 Sample Data Preview:');
    const users = await mongoose.connection.db.collection('users').findOne();
    const blogs = await mongoose.connection.db.collection('blogs').findOne();
    
    if (users) {
      console.log('👤 Sample User:', { email: users.email, role: users.role });
    }
    if (blogs) {
      console.log('📝 Sample Blog:', { title: blogs.title, author: blogs.author });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

verifyDatabase();