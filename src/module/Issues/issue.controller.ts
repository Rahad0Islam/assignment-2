import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import apiResponse from "../../utility/apiResponse";


const createIssue = async (req:Request , res : Response) => {
    try {

        const result = await issueService.createIssueIntoDb(req.body , req?.user?.id);
        const data = result.rows[0];

        return apiResponse(res,{
            statusCode:201,
            success:true,
            message:"Issue created successfully",
            data:data
        });

    } catch (error) {
        throw new Error("issue Created error");
    }
}
const getAllIssues = async (req:Request , res: Response) =>{
     try {
        const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";
        const type = typeof req.query.type === "string" ? req.query.type : undefined;
        const status = typeof req.query.status === "string" ? req.query.status : undefined;


        const result  = await issueService.getAllIssueFromDb(sort,type,status);
        if(result.length === 0 ){
          return  apiResponse(res,{
                statusCode:404,
                success:false,
                message:"issue not found",
                error:"issue not found with specific query "
            } )
        }
          return apiResponse(res,{
            statusCode:200,
            success:true,
            message:"all issues fetched successfully",
            data:result
        });
     } catch (error) {
         throw error
     }
}

export const issueController ={
    createIssue,
    getAllIssues,
}