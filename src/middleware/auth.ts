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
                message:"authorization required",
                errors:"token is missing"
            })
        }

        const decode = jwt.verify(token as string, config.jwt_secret as string)as JwtPayload;
    

        const userData = await pool.query(`
            SELECT * FROM users WHERE id = $1    
        `,[decode.id])
        
        if(userData.rows.length === 0){
           return apiResponse(res,{
                statusCode:401,
                success:false,
                message:"unauthorized",
                errors:"token is invalid"
            })
        }
        const user = userData.rows[0];
        // console.log(user);

     
        
        if(roles.length && !roles.includes(user.role)){
            return apiResponse(res,{
                statusCode:403,
                success:false,
                message:"forbidden",
                errors:"insufficient role"
            })
        }
        req.user = decode;
        next();

     } catch (error: unknown) {
         return apiResponse(res,{
            statusCode:401,
            success:false,
            message:"unauthorized",
            errors: error instanceof Error ? error.message : "invalid token"
         })
     }

    }
    
}

export default Authentication;