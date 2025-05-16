"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const userRoute_js_1 = __importDefault(require("./routes/userRoute.js"));
const linkRoute_js_1 = __importDefault(require("./routes/linkRoute.js"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8000;
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)(corsOptions));
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGODB_URI }),
}));
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
app.use((0, cookie_parser_1.default)());
app.use('/v1/api', userRoute_js_1.default);
app.use('/v1/api', linkRoute_js_1.default);
app.use('/v1/api', profileRoutes_1.default);
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});
app.listen(PORT, () => {
    console.log(`Server running port ${PORT}`);
});
(0, db_1.default)();
//# sourceMappingURL=app.js.map