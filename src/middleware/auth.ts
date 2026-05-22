import type { NextFunction, Request, Response } from "express";
import apiResponse from "../utility/apiResponse";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { pool } from "../db";
import type { Troles } from "../type";
import config from "../config/config";

const Authentication = (...roles : Troles[]) =>{

    return async (req:Request,res:Response,next:NextFunction)=>{

     try {
        const token = req.headers.authorization;

        if(!token){
           return apiResponse(res,{
                statusCode:401,
                success:false,
                message:" authorization!! ",
                data:"token does not valid"
            })
        }

        const decode = jwt.verify(token as string, config.jwt_secret as string)as JwtPayload;
    

        const userData = await pool.query(`
            SELECT * FROM users WHERE id = $1    
        `,[decode.id])
        
        if(userData.rows.length === 0){
           return apiResponse(res,{
                statusCode:404,
                success:false,
                message:"user not found",
                data:"token does not valid"
            })
        }
        const user = userData.rows[0];
        // console.log(user);

     
        
        if(roles.length && !roles.includes(user.role)){
            return apiResponse(res,{
                statusCode:403,
                success:false,
                message:"forbidden can not created issue",
                data:"roles are not valid"
            })
        }
        req.user = decode;
        next();

     } catch (error) {
         next(error);
     }

    }
    
}

export default Authentication;