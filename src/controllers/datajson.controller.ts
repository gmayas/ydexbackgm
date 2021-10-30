import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from './../database/database';
import format from 'pg-format';

// 
export const getDataJsonbyId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        let sqlString: string = format('SELECT id, array_json FROM yaydoo.datajson WHERE id = %L', id);
        console.log('sqlString Insert: ', sqlString)
        const response: QueryResult = await pool.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: response.rows
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in query',
            error: e
        })
    }
};
//
export const createDataJson = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { array_json }: any = req.body;
        const data = JSON.stringify(array_json)
        const sqlString = `INSERT INTO yaydoo.datajson (array_json) VALUES ('${data}')`;
        console.log('sqlString Insert: ', sqlString)
        const saveUser: QueryResult = await pool.query(sqlString);
        return res.status(200).json(array_json);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        })
    }
};