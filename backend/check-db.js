import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Environment variables:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI || 'NOT SET');
    console.log('- MONGODB_URI_PROD:', process.env.MONGODB_URI_PROD || 'NOT SET');
    const mongoUri = process.env.MONGODB_URI ;
    console.log('Final MongoDB URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Port: ${conn.connection.port}`);
    console.log(`Connection String: ${conn.connection.client.s.url}`);
    console.log(`Cluster: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Get more detailed connection info
    const adminDb = conn.connection.db.admin();
    try {
      const serverInfo = await adminDb.serverInfo();
      console.log(`MongoDB Version: ${serverInfo.version}`);
      console.log(`Storage Engine: ${serverInfo.storageEngine?.name || 'N/A'}`);
    } catch (e) {
      console.log('Could not get server info (requires admin privileges)');
    }
    
    // Check if we can access the users collection directly
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log('\n📚 Available collections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
      
      // Get detailed collection info
      console.log('\n📊 Collection Details:');
      for (const col of collections) {
        try {
          const collection = db.collection(col.name);
          const count = await collection.countDocuments();
                     const collectionInfo = await db.command({ collStats: col.name });
           console.log(`\nCollection: ${col.name}`);
           console.log(`  Document Count: ${count}`);
           console.log(`  Size: ${(collectionInfo.size / 1024).toFixed(2)} KB`);
           console.log(`  Storage Size: ${(collectionInfo.storageSize / 1024).toFixed(2)} KB`);
           console.log(`  Indexes: ${collectionInfo.nindexes || 'N/A'}`);
        } catch (e) {
          console.log(`  Error getting stats for ${col.name}: ${e.message}`);
        }
      }
      
      // Try to access users collection directly
      if (collections.some(col => col.name === 'users')) {
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log(`\n👥 Users collection found with ${userCount} documents`);
        
        if (userCount > 0) {
          const allUsers = await usersCollection.find({}).toArray();
          console.log('\n=== ALL USERS IN DATABASE ===');
          allUsers.forEach((user, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(`  ID: ${user._id}`);
            console.log(`  Name: ${user.name || 'N/A'}`);
            console.log(`  Email: ${user.email || 'N/A'}`);
            console.log(`  Role: ${user.role || 'N/A'}`);
            console.log(`  Password: ${user.password || 'N/A'}`);
            console.log(`  Password type: ${typeof user.password}`);
            console.log(`  Password length: ${user.password ? user.password.length : 'N/A'}`);
            console.log(`  Created: ${user.createdAt || 'N/A'}`);
            console.log(`  Updated: ${user.updatedAt || 'N/A'}`);
          });
          console.log('=== END USERS LIST ===\n');
        }
      } else {
        console.log('\n❌ Users collection not found');
      }
      
    } catch (collectionError) {
      console.log('Error accessing collections:', collectionError.message);
    }
    
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:', error.message);
    console.error('Full error:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 MongoDB disconnected');
    }
    process.exit(0);
  }
};

checkDatabase();
