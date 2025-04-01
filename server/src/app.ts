import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import expressLayout from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Request, Response } from 'express';
import userRoutes from './routes/userRoute.js';
import linkRoutes from './routes/linkRoute.js';

dotenv.config();

const app = express();
const PORT = 8000;
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(expressLayout);
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use('/v1/api', userRoutes);
app.use('/v1/api', linkRoutes);
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
  console.log(`Server running port ${PORT}`);
});

connectDB();
