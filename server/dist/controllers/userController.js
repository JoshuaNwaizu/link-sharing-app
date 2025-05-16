"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = exports.login = exports.createAccount = exports.logout = exports.getToken = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT Secret not provided');
}
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, {
        expiresIn: '90d',
    });
};
const createAccount = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        console.log('Request: ', req.body);
        try {
            const user = await UserModel_1.default.create({
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
            console.log('Register data recieved successfully', email, password, user, token);
        }
        catch (error) {
            const mongoError = error;
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
    }
    catch (error) {
        console.error(error);
    }
});
exports.createAccount = createAccount;
const login = (0, catchAsync_1.default)(async (req, res) => {
    try {
        console.log('Request: ', req.body);
        const { email, password } = req.body;
        const user = await UserModel_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials', success: false });
            return;
        }
        console.log('Password from request:', password);
        console.log('User password from DB:', user.password);
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            messageBody: error instanceof Error ? error.message : error,
        });
        return;
    }
});
exports.login = login;
const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
exports.isAuthenticated = isAuthenticated;
const getToken = () => {
    return localStorage.getItem('token');
};
exports.getToken = getToken;
const logout = () => {
    localStorage.removeItem('token');
};
exports.logout = logout;
const protectedRoute = (0, catchAsync_1.default)(async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // 3. Check user exists
        const currentUser = await UserModel_1.default.findById(decoded.id);
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
    }
    catch (error) {
        console.error('JWT Error:', error);
        res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired token',
        });
        return;
    }
});
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=userController.js.map