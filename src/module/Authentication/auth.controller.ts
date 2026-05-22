import type { Request, Response } from "express";
import { authService } from "./auth.service";
import apiResponse from "../../utility/apiResponse";


const signup = async (req : Request , res : Response) =>{
     try {
        const result = await authService.signupIntoDb(req.body);

        return apiResponse(res,{
            statusCode:201,
            success:true,
            message:'User registered successfully',
            data:result
         })
        
     } catch (error:any) {
        return apiResponse(res,{
            statusCode:400,
            success:false,
            message:"user register failed",
            error:error.message
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
    } catch (error:any) {
        return apiResponse(res,{
            statusCode:400,
            success:false,
            message:"user login failed",
            error:error.message
         })
    }
}

export const authController ={
    signup,
    login,

}