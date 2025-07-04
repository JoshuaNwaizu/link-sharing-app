import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import expressLayout from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRoutes from './routes/userRoute.js';
import linkRoutes from './routes/linkRoute.js';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();
const PORT = 8000;
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Important for cookies
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(expressLayout);
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 24 * 60 * 60, // 60 days session lifetime
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
      path: '/',
    },
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use(cookieParser());
app.use('/v1/api', userRoutes);
app.use('/v1/api', linkRoutes);
app.use('/v1/api', profileRoutes);

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});
app.listen(PORT, () => {
  console.log(`Server running port ${PORT}`);
});

connectDB();
