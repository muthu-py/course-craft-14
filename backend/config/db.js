import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD || 'mongodb://127.0.0.1:27017/coursecraft';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Show detailed connection info
    console.log(`\n🔗 Connection Details:`);
    console.log(`  Host/Cluster: ${conn.connection.host}`);
    console.log(`  Port: ${conn.connection.port}`);
    console.log(`  Database: ${conn.connection.name}`);
    console.log(`  Connection String: ${conn.connection.client.s.url}`);
    
    // Get server info
    try {
      const adminDb = conn.connection.db.admin();
      const serverInfo = await adminDb.serverInfo();
      console.log(`  MongoDB Version: ${serverInfo.version}`);
      console.log(`  Storage Engine: ${serverInfo.storageEngine?.name || 'N/A'}`);
    } catch (e) {
      console.log('  Could not get server info (requires admin privileges)');
    }
    
    // Show all collections
    try {
      const db = conn.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`\n📚 Available Collections:`);
      if (collections.length === 0) {
        console.log('  No collections found');
      } else {
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
        
                 // Get detailed collection stats
         console.log(`\n📊 Collection Details:`);
         for (const col of collections) {
           try {
             const collection = db.collection(col.name);
             const count = await collection.countDocuments();
             
             // Use dbStats for database-level info and collection info
             const collectionInfo = await db.command({ collStats: col.name });
             
             console.log(`\nCollection: ${col.name}`);
             console.log(`  Document Count: ${count}`);
             console.log(`  Size: ${(collectionInfo.size / 1024).toFixed(2)} KB`);
             console.log(`  Storage Size: ${(collectionInfo.storageSize / 1024).toFixed(2)} KB`);
             console.log(`  Indexes: ${collectionInfo.nindexes || 'N/A'}`);
             console.log(`  Average Document Size: ${(collectionInfo.avgObjSize / 1024).toFixed(2)} KB`);
           } catch (e) {
             console.log(`  Error getting stats for ${col.name}: ${e.message}`);
           }
         }
      }
    } catch (collectionError) {
      console.log('Could not access collections:', collectionError.message);
    }
    
    // Print all users from the users collection when connected
    try {
      const User = mongoose.model('User');
      const allUsers = await User.find({}, 'email role name password createdAt updatedAt');
      console.log('\n=== ALL USERS IN DATABASE ===');
      if (allUsers.length === 0) {
        console.log('No users found in database');
      } else {
        allUsers.forEach((user, index) => {
          console.log(`\nUser ${index + 1}:`);
          console.log(`  ID: ${user._id}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Role: ${user.role}`);
          console.log(`  Password: ${user.password}`);
          console.log(`  Password type: ${typeof user.password}`);
          console.log(`  Password length: ${user.password ? user.password.length : 'N/A'}`);
          console.log(`  Created: ${user.createdAt}`);
          console.log(`  Updated: ${user.updatedAt}`);
        });
      }
      console.log('=== END USERS LIST ===\n');
    } catch (userError) {
      console.log('Could not fetch users (User model not available yet):', userError.message);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB; 