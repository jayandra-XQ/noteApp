import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';

const app = express();

const port = process.env.PORT || 5000;



// Safely checking the MongoDB connection string
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING as string;

mongoose.connect(mongoConnectionString)
.then(()=> {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
})
