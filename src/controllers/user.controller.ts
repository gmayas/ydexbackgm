import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from './../database/database';
import format from 'pg-format';
import { encrypPassword } from './../libs/Validations';
import * as _ from 'lodash';

/*
format(fmt, ...)
%% outputs a literal % character.
%I outputs an escaped SQL identifier.
%L outputs an escaped SQL literal.
%s outputs a simple string.
*/

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const sqlString: string = format('SELECT id_user, name_user, email_user, password_user FROM %s Order by id_user DESC', 'yaydoo.users');
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

// Get User by Email
export const getUserbyEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.params;
        let sqlString: string = format('SELECT id_user, name_user, email_user, password_user FROM %s WHERE email_user = %L', 'yaydoo.users', email);
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

// Get all user data.
export const getDataUseFull = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string = 'SELECT id_user, name_user, email_user, password_user, id_userdata, address_userdata, phone_userdata, birthdate_userdata, Age(birthdate_userdata) age_userdata '
            + 'FROM yaydoo.users LEFT JOIN yaydoo.userdata ON (id_user = id_user_userdata) Order by id_user';
        console.log('sqlString: ', sqlString);
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

// Email exists
export const emailExists = async (email_user: string) => {
    try {
        const sqlString: string = format('SELECT id_user FROM %s WHERE email_user = %L', 'yaydoo.users', email_user);
        const emailuserExists: QueryResult = await pool.query(sqlString);
        console.log('emailuserExists firt: ', _.get(emailuserExists.rows[0], 'id_user'));
        if (emailuserExists.rowCount > 0) {
            return { Ok: true, id_user: _.get(emailuserExists.rows[0], 'id_user') }
        } else {
            return { Ok: false, id_user: null }
        }
    }
    catch (e) {
        console.log(e);
        return { Ok: false, id_user: null }
    }
};

// Id user exists
export const userDataCount = async (id_user: any) => {
    try {
        const sqlString: string = format('SELECT Count (*) UsersCount FROM yaydoo.userdata WHERE id_user_userdata = %L', id_user);
        const UsersCount: QueryResult = await pool.query(sqlString);
        const dataReturn = _.toNumber(_.get(UsersCount.rows[0], 'userscount'));
        return { Ok: true, count: dataReturn }
    }
    catch (e) {
        console.log(e);
        return { Ok: false, count: 0 }
    }
};

// Create user 
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        let emailuserExists: any;
        const newUser: any = {
            name_user: req.body.name_user,
            email_user: req.body.email_user,
            password_user: await encrypPassword(req.body.password_user)
        };
        // Email Validation
        emailuserExists = await emailExists(newUser.email_user);
        console.log('emailuserExists:', emailuserExists)
        if (emailuserExists.Ok) return res.status(400).json('Email already exists');
        // insert newUser
        sqlString = format('INSERT INTO yaydoo.users (name_user, email_user, password_user) '
            + 'VALUES %L', [[newUser.name_user, newUser.email_user, newUser.password_user]]);
        console.log('sqlString Insert: ', sqlString)
        const saveUser: QueryResult = await pool.query(sqlString);
        emailuserExists = await emailExists(newUser.email_user);
        if (emailuserExists.Ok) { newUser.id_user = emailuserExists.id_user }
        newUser.success = true;
        return res.status(200).json(newUser);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        })
    }
};

// Create user with array 
export const createUserArray = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        const newUser: any = req.body;
        let newValues: any = await Promise.all(newUser.map(
            async (value: { name_user: any; email_user: any; password_user: string; }) => {
                let passworduser = await encrypPassword(value.password_user);
                let dataReturn = [value.name_user, value.email_user, passworduser];
                return dataReturn;
            }
        ));
        console.log('newValues: ', newValues);
        sqlString = format('INSERT INTO yaydoo.users (name_user, email_user, password_user) VALUES %L', newValues);
        console.log('sqlString Insert: ', sqlString)
        const saveUser: QueryResult = await pool.query(sqlString);
        return res.status(200).json({
            message: 'Query succesfully',
            data: { Response: newValues }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            error: e
        })
    }
};

// Modify password 
export const modifyPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        const { id_user } = req.params;
        const newPassword: any = await encrypPassword(req.body.password_user);
        // Update
        sqlString = format('UPDATE yaydoo.users	SET password_user = %L WHERE id_user = %L', newPassword, id_user);
        console.log('sqlString Update: ', sqlString)
        const saveUser: QueryResult = await pool.query(sqlString);
        return res.status(200).json(
            {
                message: 'Query succesfully',
                success: true,
                error: 'Not error'
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        })
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        const { id_user } = req.params;
        // Verifica si tiiene datos de usuario
        const UsersCount = await userDataCount(id_user);
        console.log('UsersCount:', UsersCount)
        //{ Ok: true, count: 0 }
        if (UsersCount.count > 0) {
            // Elimina si tiene datos de usuario   
            sqlString = format('DELETE FROM yaydoo.userdata WHERE id_user_userdata = %L', id_user);
            console.log('sqlString DeleteUserData: ', sqlString)
            const delUserData: QueryResult = await pool.query(sqlString);
        }
        // Delete user
        sqlString = format('DELETE FROM yaydoo.users WHERE id_user = %L', id_user);
        console.log('sqlString Delete User: ', sqlString)
        const delUser: QueryResult = await pool.query(sqlString);
        return res.status(200).json(
            {
                message: 'Query succesfully',
                success: true,
                error: 'Not error'
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        })
    }
};

// Get User data by id user
export const getUserDataByIdUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id_user } = req.params;
        let sqlString: string = format('SELECT id_userdata, id_user_userdata, address_userdata, phone_userdata, birthdate_userdata, Age(birthdate_userdata) age_userdata  '
            + 'FROM yaydoo.userdata WHERE id_user_userdata = %L', id_user);

        console.log('sqlString Get User data: ', sqlString)
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



// Create user data 
export const createUserData = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id_user_userdata, address_userdata, phone_userdata, birthdate_userdata } = req.body;
        // insert 
        const sqlString: string = format('INSERT INTO yaydoo.userdata(id_user_userdata, address_userdata, phone_userdata, birthdate_userdata)'
            + 'VALUES %L', [[id_user_userdata, address_userdata, phone_userdata, birthdate_userdata]]);
        console.log('sqlString Insert: ', sqlString)
        const saveUserData: QueryResult = await pool.query(sqlString);
        return res.status(200).json(
            {
                message: 'Query succesfully',
                success: true,
                error: 'Not error'
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        })
    }
};

// Modify user data
export const modifyUserData = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        const { id_userdata } = req.params;
        const { address_userdata, phone_userdata, birthdate_userdata } = req.body;
        // Update
        sqlString = format('UPDATE yaydoo.userdata SET address_userdata = %L, phone_userdata = %L, birthdate_userdata = %L '
            + 'WHERE id_userdata = %L', address_userdata, phone_userdata, birthdate_userdata, id_userdata);
        console.log('sqlString Update: ', sqlString)
        const saveUserData: QueryResult = await pool.query(sqlString);
        return res.status(200).json(
            {
                message: 'Query succesfully',
                success: true,
                error: 'Not error'
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        })
    }
};

// Delete user data
export const deleteUserData = async (req: Request, res: Response): Promise<Response> => {
    try {
        let sqlString: string;
        const { id_userdata } = req.params;
        // Delete
        sqlString = format('DELETE FROM yaydoo.userdata WHERE id_userdata = %L', id_userdata);
        console.log('sqlString Delete: ', sqlString)
        const delUserData: QueryResult = await pool.query(sqlString);
        return res.status(200).json(
            {
                message: 'Query succesfully',
                success: true,
                error: 'Not error'
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error in create user',
            success: false,
            error: e
        })
    }
};