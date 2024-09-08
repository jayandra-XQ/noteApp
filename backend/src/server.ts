import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';

import noteRoutes from "./routes/note.route"
import userRoutes from "./routes/user.route"
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { requiresAuth } from './middleware/auth';

const app = express();

app.use(morgan("dev"));

app.use(express.json());

const sessionSecret : string = process.env.SESSION_SECRET || 'defaultSecret';

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_STRING
  })

}))


const port = process.env.PORT || 5002;


app.use('/api/user', userRoutes);
app.use('/api/notes' ,requiresAuth,  noteRoutes);



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
