"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.deleteUserData = exports.modifyUserData = exports.createUserData = exports.getUserDataByIdUser = exports.deleteUser = exports.modifyPassword = exports.createUserArray = exports.createUser = exports.emailExists = exports.getDataUseFull = exports.getUserbyEmail = exports.getUsers = void 0;
const database_1 = __importDefault(require("./../database/database"));
const pg_format_1 = __importDefault(require("pg-format"));
const Validations_1 = require("./../libs/Validations");
const _ = __importStar(require("lodash"));
/*
format(fmt, ...)
%% outputs a literal % character.
%I outputs an escaped SQL identifier.
%L outputs an escaped SQL literal.
%s outputs a simple string.
*/
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlString = (0, pg_format_1.default)('SELECT id_user, name_user, email_user, password_user FROM %s Order by id_user', 'yaydoo.users');
        const response = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.getUsers = getUsers;
// Get User by Email
const getUserbyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        let sqlString = (0, pg_format_1.default)('SELECT id_user, name_user, email_user, password_user FROM %s WHERE email_user = %L', 'yaydoo.users', email);
        const response = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.getUserbyEmail = getUserbyEmail;
// Get all user data.
const getDataUseFull = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString = 'SELECT id_user, name_user, email_user, password_user, id_userdata, address_userdata, phone_userdata, birthdate_userdata, Age(birthdate_userdata) age_userdata '
            + 'FROM yaydoo.users LEFT JOIN yaydoo.userdata ON (id_user = id_user_userdata) Order by id_user';
        console.log('sqlString: ', sqlString);
        const response = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.getDataUseFull = getDataUseFull;
// Email exists
const emailExists = (email_user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlString = (0, pg_format_1.default)('SELECT id_user FROM %s WHERE email_user = %L', 'yaydoo.users', email_user);
        const emailuserExists = yield database_1.default.query(sqlString);
        console.log('emailuserExists firt: ', _.get(emailuserExists.rows[0], 'id_user'));
        if (emailuserExists.rowCount > 0) {
            return { Ok: true, id_user: _.get(emailuserExists.rows[0], 'id_user') };
        }
        else {
            return { Ok: false, id_user: null };
        }
    }
    catch (e) {
        console.log(e);
        return { Ok: false, id_user: null };
    }
});
exports.emailExists = emailExists;
// Create user 
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        let emailuserExists;
        const newUser = {
            name_user: req.body.name_user,
            email_user: req.body.email_user,
            password_user: yield (0, Validations_1.encrypPassword)(req.body.password_user)
        };
        // Email Validation
        emailuserExists = yield (0, exports.emailExists)(newUser.email_user);
        console.log('emailuserExists:', emailuserExists);
        if (emailuserExists.Ok)
            return res.status(400).json('Email already exists');
        // insert newUser
        sqlString = (0, pg_format_1.default)('INSERT INTO yaydoo.users (name_user, email_user, password_user) '
            + 'VALUES %L', [[newUser.name_user, newUser.email_user, newUser.password_user]]);
        console.log('sqlString Insert: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        emailuserExists = yield (0, exports.emailExists)(newUser.email_user);
        if (emailuserExists.Ok) {
            newUser.id_user = emailuserExists.id_user;
        }
        newUser.success = true;
        return res.status(200).json(newUser);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        });
    }
});
exports.createUser = createUser;
// Create user with array 
const createUserArray = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        const newUser = req.body;
        let newValues = yield Promise.all(newUser.map((value) => __awaiter(void 0, void 0, void 0, function* () {
            let passworduser = yield (0, Validations_1.encrypPassword)(value.password_user);
            let dataReturn = [value.name_user, value.email_user, passworduser];
            return dataReturn;
        })));
        console.log('newValues: ', newValues);
        sqlString = (0, pg_format_1.default)('INSERT INTO yaydoo.users (name_user, email_user, password_user) VALUES %L', newValues);
        console.log('sqlString Insert: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: { Response: newValues }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        });
    }
});
exports.createUserArray = createUserArray;
// Modify password 
const modifyPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        const { id_user } = req.params;
        const newPassword = yield (0, Validations_1.encrypPassword)(req.body.password_user);
        // Update
        sqlString = (0, pg_format_1.default)('UPDATE yaydoo.users	SET password_user = %L WHERE id_user = %L', newPassword, id_user);
        console.log('sqlString Update: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            success: true,
            error: 'Not error'
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        });
    }
});
exports.modifyPassword = modifyPassword;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        const { id_user } = req.params;
        // Delete
        sqlString = (0, pg_format_1.default)('DELETE FROM yaydoo.users WHERE id_user = %L', id_user);
        console.log('sqlString Delete: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            success: true,
            error: 'Not error'
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        });
    }
});
exports.deleteUser = deleteUser;
// Get User data by id user
const getUserDataByIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_user } = req.params;
        let sqlString = (0, pg_format_1.default)('SELECT id_userdata, id_user_userdata, address_userdata, phone_userdata, birthdate_userdata '
            + 'FROM yaydoo.userdata WHERE id_user_userdata = %L', id_user);
        console.log('sqlString Get User data: ', sqlString);
        const response = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        });
    }
});
exports.getUserDataByIdUser = getUserDataByIdUser;
// Create user data 
const createUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_user_userdata, address_userdata, phone_userdata, birthdate_userdata } = req.body;
        // insert 
        const sqlString = (0, pg_format_1.default)('INSERT INTO yaydoo.userdata(id_user_userdata, address_userdata, phone_userdata, birthdate_userdata)'
            + 'VALUES %L', [[id_user_userdata, address_userdata, phone_userdata, birthdate_userdata]]);
        console.log('sqlString Insert: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            success: true,
            error: 'Not error'
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        });
    }
});
exports.createUserData = createUserData;
// Modify user data
const modifyUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        const { id_userdata } = req.params;
        const { address_userdata, phone_userdata, birthdate_userdata } = req.body;
        // Update
        sqlString = (0, pg_format_1.default)('UPDATE yaydoo.userdata SET address_userdata = %L, phone_userdata = %L, birthdate_userdata = %L '
            + 'WHERE id_userdata = %L', address_userdata, phone_userdata, birthdate_userdata, id_userdata);
        console.log('sqlString Update: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            success: true,
            error: 'Not error'
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        });
    }
});
exports.modifyUserData = modifyUserData;
// Delete user data
const deleteUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sqlString;
        const { id_userdata } = req.params;
        // Update
        sqlString = (0, pg_format_1.default)('DELETE FROM yaydoo.userdata WHERE id_userdata = %L', id_userdata);
        console.log('sqlString Delete: ', sqlString);
        const savedUser = yield database_1.default.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            success: true,
            error: 'Not error'
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        });
    }
});
exports.deleteUserData = deleteUserData;
