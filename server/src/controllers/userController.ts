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
    // Check if user exists first
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        message: 'Email already in use',
      });
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
        email: user.email,
        password,
        userId: user._id,

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
        console.error('User already exists:', mongoError);
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
      path: '/',
    });
    res.json({
      message: 'Form data recieved successfully',
      email: user.email,
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

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Fetching user with ID:', id);

    const user = await User.findById(id).select('-password');

    if (!user) {
      console.log('No user found with ID:', id);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Found user:', user.email);
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res
    .status(200)
    .json({ status: 'success', message: 'Logged out successfully' });
});

const protectedRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from both cookie and header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
      return;
    }
    try {
      // 2. Verify token
      const decoded = jwt.verify(token, jwtSecret) as { id: string };

      // 3. Check user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        res.status(401).json({
          status: 'fail',
          message: 'User no longer exists',
        });
        return;
      }

      // 4. Add user to request
      req.user = currentUser;
      next();
    } catch (error) {
      console.error('JWT Error:', error);
      res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token',
      });
      return;
    }
  },
);
export const checkAuth = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'Not authenticated',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
});
export { createAccount, login, protectedRoute };
