import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import User from '../models/UserModel';
import dotenv from 'dotenv';
import { Document } from 'mongoose';
dotenv.config();

interface IUser {
  email: string;
  password: string;
  passwordChangedAt?: Date | null;
}
declare module 'express' {
  interface Request {
    user?: (Document & IUser) | null;
  }
}

interface MongoError extends Error {
  code?: number;
}

const jwtSecret: string = process.env.JWT_SECRET as string;
if (!jwtSecret) {
  throw new Error('JWT Secret not provided');
}
const signToken = (id: string): string => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '90d',
  });
};

const createAccount = catchAsync(async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }
    const hashedPass = await bcrypt.hash(password, 10);
    console.log('Request: ', req.body);

    try {
      const user = await User.create({
        email,
        password: hashedPass,
      });
      const token = signToken(user._id.toString());
      res.status(201).json({
        message: 'Register data recieved successfully',
        email,
        password,
        user,
        token,
      });
      console.log(
        'Register data recieved successfully',
        email,
        password,
        user,
        token,
      );
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
      console.error(mongoError);
    }
    res.json({
      message: 'Register data recieved successfully',
      email,
      // password,
    });
    console.log(`user:${email}  password:${password}`);
  } catch (error: unknown) {
    console.error(error);
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log('Request: ', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials', success: false });
      return;
    }
    console.log('Password from request:', password);
    console.log('User password from DB:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('User Found:', user);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials', success: false });
      return;
    }
    const token = signToken(user._id.toString());
    res.cookie('token', token, {
      httpOnly: true,
    });
    res.json({
      message: 'Form data recieved successfully',
      email: user.email,
      token,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      messageBody: error instanceof Error ? error.message : error,
    });
    return;
  }
});
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};
const protectedRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the cookies
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res
          .status(403)
          .json({ message: 'You are not logged in', success: false });
        return;
      }
      // Verify the token
      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        res.status(403).json({
          message: ' The user belonging to this token no longer exist',
          success: false,
        });
        return;
      }
      req.user = currentUser;

      next();
    } catch (error: unknown) {
      res.status(403).json({ message: 'Invalid token. Please Login' });
    }
  },
);

export { createAccount, login, protectedRoute };
