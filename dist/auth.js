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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.setUser = exports.isAuthenticated = void 0;
const userMap = new Map();
const setUser = (id, user) => {
    userMap.set(id, user);
};
exports.setUser = setUser;
const getUser = (id) => {
    return userMap.get(id);
};
exports.getUser = getUser;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sessionId = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.session;
    if (!sessionId) {
        res.redirect("/login");
        return;
    }
    const currUser = getUser(sessionId);
    if (!currUser) {
        res.send("your are lougout");
        return;
    }
    req.user = currUser;
    next();
});
exports.isAuthenticated = isAuthenticated;
