import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/astra-ecommerce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Automatically drop legacy/deprecated unique indexes (like username_1) if present
    try {
      const usersCollection = conn.connection.collection('users');
      const indexes = await usersCollection.indexes();
      const usernameIndex = indexes.find((idx) => idx.name === 'username_1');
      if (usernameIndex) {
        await usersCollection.dropIndex('username_1');
        console.log('Cleaned up deprecated username_1 unique index from users collection.');
      }
    } catch (indexError) {
      // Ignore if collection is empty or not yet indexed
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
