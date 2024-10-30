"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path = __importStar(require("path"));
const connect_js_1 = require("./connect.js");
const urlMode_js_1 = __importDefault(require("./urlMode.js"));
const userModel_js_1 = __importDefault(require("./userModel.js"));
const shortid = require("shortid");
const auth_1 = require("./auth");
dotenv.config();
(0, connect_js_1.connectDatabase)(process.env.DATABASE_URL);
const app = (0, express_1.default)();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/playground', (req, res) => {
    res.render('playground', { nameOne: "Rahul Warkade", nameTwo: "Alpha monhito", nameThree: "Beta Gama", nameFour: "Ami lorem" });
});
app.post('/shorturl', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shortUrl = yield urlMode_js_1.default.create({
        id: shortid.generate(),
        redirecteUrl: req.body.url,
        visitHistory: []
    });
    if (!req.user) {
        res.redirect('login');
        return;
    }
    const mainUser = yield userModel_js_1.default.findOne({ email: req.user.email });
    if (!mainUser) {
        res.redirect('login');
        return;
    }
    mainUser.urls.push(shortUrl.id);
    yield mainUser.save();
    res.render('home', { urls: mainUser.urls });
}));
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/logup', (req, res) => {
    res.render('signup');
});
app.post('/sigin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_js_1.default.findOne({ username: req.body.username, password: req.body.password });
    if (!user) {
        res.send('user not found');
        return;
    }
    req.user = user;
    const sessionId = shortid.generate();
    (0, auth_1.setUser)(sessionId, user);
    res.cookie('session', sessionId);
    res.render('home', { urls: req.user.urls });
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_js_1.default.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        urls: []
    });
    if (user)
        res.render('login');
}));
app.get('/home', auth_1.isAuthenticated, (req, res) => {
    var _a;
    res.render('home', { urls: (_a = req.user) === null || _a === void 0 ? void 0 : _a.urls });
});
app.post('/:shortUrl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield urlMode_js_1.default.findOne({ id: req.params.shortUrl });
    if (!url) {
        res.end("url is not found");
        return;
    }
    url.visitHistory.push({ timestamp: Date.now() });
    yield url.save();
    res.redirect(url.redirecteUrl);
}));
app.get('/analytics/:shortUrl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield urlMode_js_1.default.findOne({ id: req.params.shortUrl });
    if (!url) {
        res.end("url is not found");
        return;
    }
    res.status(200).json({ visits: url.visitHistory.length, original: url.redirecteUrl });
}));
app.listen(process.env.PORT, () => { console.log(`server is running on port : ${process.env.PORT}`); });
