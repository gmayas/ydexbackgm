"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
// Cors
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const datajson_1 = __importDefault(require("./routes/datajson"));
const app = (0, express_1.default)();
// settings
app.set('port', process.env.PORT || 3000);
// Middlewares
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))
// Cors
app.use((0, cors_1.default)());
//
// Routes
app.use('/api/user', user_1.default);
app.use('/api/dataJson', datajson_1.default);
exports.default = app;
