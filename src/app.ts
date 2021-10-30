import express, { Application } from 'express';
import morgan from 'morgan';

import bodyParser from 'body-parser';

// Cors
import cors from 'cors';

import UserController from './routes/user';
import dataJsonController from './routes/datajson';

const app: Application = express();

// settings
app.set('port', process.env.PORT || 3000 );

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))

// Cors
app.use(cors())

//
// Routes
app.use('/api/user', UserController);
app.use('/api/dataJson', dataJsonController);
export default app;