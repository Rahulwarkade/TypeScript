"use strict";
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
exports.getUser = exports.setUser = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = 'rahul';
const setUser = (user) => {
    return jsonwebtoken_1.default.sign({ username: user.username, email: user.email, password: user.password }, secret);
};
exports.setUser = setUser;
const getUser = (token) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.getUser = getUser;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    const currUser = jsonwebtoken_1.default.verify(token, secret);
    if (!currUser) {
        res.send("your are lougout");
        return;
    }
    next();
});
exports.isAuthenticated = isAuthenticated;
