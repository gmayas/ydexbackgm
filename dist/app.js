"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
// settings
app.set('port', process.env.PORT || 3000);
// Middlewares
app.use((0, morgan_1.default)('dev'));
/*app.use(express.urlencoded({ extended: true }))
app.use(express.json());*/
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//
// Routes
app.use('/api/user', user_1.default);
exports.default = app;
