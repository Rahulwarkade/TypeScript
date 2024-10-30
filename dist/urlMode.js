"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var urlSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        unique: true,
    },
    redirecteUrl: {
        type: String,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'userModel'
    }
});
const urlModel = mongoose_1.default.model('urlModel', urlSchema);
exports.default = urlModel;
