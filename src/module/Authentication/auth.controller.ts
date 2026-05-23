import type { Request, Response } from "express";
import { authService } from "./auth.service";
import apiResponse from "../../utility/apiResponse";
import { getErrorMessage } from "../../utility/getErrorMsg";


const signup = async (req : Request , res : Response) =>{
     try {
        const result = await authService.signupIntoDb(req.body);

        return apiResponse(res,{
            statusCode:201,
            success:true,
            message:'User registered successfully',
            data:result
         })
        
     } catch (error: unknown) {
        return apiResponse(res,{
            statusCode:400,
            success:false,
            message:"user register failed",
            errors:getErrorMessage(error)
         })
     }
}


const login = async (req : Request , res : Response) =>{
    try {
        const result =  await authService.loginDB(req.body);
       return apiResponse(res,{
            statusCode:200,
            success:true,
            message:'Login successful',
            data:result
        })
    } catch (error: unknown) {
        return apiResponse(res,{
            statusCode:400,
            success:false,
            message:"user login failed",
            errors:getErrorMessage(error)
         })
    }
}

export const authController ={
    signup,
    login,

}