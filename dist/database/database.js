"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const isProduction = process.env.NODE_ENV === 'production';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const connection = `postgresql://${process.env.User}:${process.env.Password}@${process.env.Host}:${process.env.Port}/${process.env.Database}`;
const pool = new pg_1.Pool({
    connectionString: isProduction ? process.env.URI : connection,
    ssl: true,
});
exports.default = pool;
