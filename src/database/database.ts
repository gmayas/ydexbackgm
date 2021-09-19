import { Pool } from 'pg';
const isProduction = process.env.NODE_ENV === 'production'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connection = `postgresql://${process.env.User}:${process.env.Password}@${process.env.Host}:${process.env.PortPG}/${process.env.Database}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.URI : connection,
  ssl: true,
})

export default pool;

