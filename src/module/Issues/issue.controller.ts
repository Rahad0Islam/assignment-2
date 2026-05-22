import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import apiResponse from "../../utility/apiResponse";

const getErrorMessage = (error: unknown) => {
    return error instanceof Error ? error.message : "Unexpected error";
}

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

    } catch (error: unknown) {
        return apiResponse(res,{
            statusCode:500,
            success:false,
            message:"issue created error",
            errors:getErrorMessage(error)
        })
    }
}

const getAllIssues = async (req:Request , res: Response) =>{
     try {
        const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";
        const type = typeof req.query.type === "string" ? req.query.type : undefined;
        const status = typeof req.query.status === "string" ? req.query.status : undefined;


        const result  = await issueService.getAllIssueFromDb(sort,type,status);
                return apiResponse(res,{
            statusCode:200,
            success:true,
            message:"all issues fetched successfully",
            data:result
        });
         } catch (error: unknown) {
                 return apiResponse(res,{
                        statusCode:500,
                        success:false,
                        message:"issue fetch failed",
                        errors:getErrorMessage(error)
                 })
     }
}

const getIssueById = async (req:Request , res: Response) =>{
     try {
        const id= Number(req?.params?.id);
        const issue  = await issueService.getIssueByidFromDb(id);
        if(!issue){
            return apiResponse(res,{
                statusCode:404,
                success:false,
                message:"issue not found",
                errors:"issue not found"
            })
        }

         const user = await issueService.finduserByid(issue.reporter_id);
        // console.log(issueData)
        const result =  {
                    id: issue.id,
                    title: issue.title,
                    description: issue.description,
                    type: issue.type,
                    status: issue.status,

                    reporter: {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    },

                    created_at: issue.created_at,
                    updated_at: issue.updated_at
                }


          return apiResponse(res,{
            statusCode:200,
            success:true,
            message:"issue fetched successfully",
            data:result
        });
     } catch (error: unknown) {
         return apiResponse(res,{
            statusCode:500,
            success:false,
            message:"issue fetch failed",
            errors:getErrorMessage(error)
         })
     }
}

const updateIssueByid = async (req:Request , res: Response) =>{
    try {
       
        const IssueId = Number( req.params.id );
        const id = req.user?.id;
        const issue  = await issueService.getIssueByidFromDb(IssueId);
        if(!issue){
            return apiResponse(res,{
                statusCode:404,
                success:false,
                message:"issue not found",
                errors:"issue not found"
            })
        }
        const userId = issue.reporter_id;
        const role = req.user?.role;
        if(role === 'maintainer'){
            const result = await issueService.updateIssueByidIntoDb(IssueId ,req.body);
        
           return apiResponse(res,{
              statusCode:200,
              success:true,
              message:"Issue updated successfully",
              data:result
           });
            
        }
        if(id !== userId){
            return apiResponse(res,{
                statusCode:403,
                success:false,
                message:"not permission to update issue",
                errors:"forbidden"
            })
        }
        if(issue.status !== 'open'){
            return apiResponse(res,{
                statusCode:409,
                success:false,
                message:"issue cannot be updated",
                errors:"issue is not open"
            })
        }
        const result = await issueService.updateIssueByidIntoDb(IssueId ,req.body);
        return apiResponse(res,{
            statusCode:200,
            success:true,
            message:"Issue updated successfully",
            data:result
        });

    } catch (error: unknown) {
        return apiResponse(res,{
            statusCode:500,
            success:false,
            message:"issue update failed",
            errors:getErrorMessage(error)
        })
    }
}

const deleteIssueById = async (req:Request , res: Response) =>{
    try {
        const IssueId = Number( req.params.id );
        const issue  = await issueService.getIssueByidFromDb(IssueId);
        // console.log(issue)
        if(!issue){
           return apiResponse(res,{
                statusCode:404,
                success:false,
                message:"issue not found",
                errors:"issue not found"
            })
        }
         await issueService.deleteIssueFromDb(Number(req.params?.id));
        return apiResponse(res,{
            statusCode:200,
            success:true,
            message:'Issue deleted successfully'
        })
    } catch (error: unknown) {
        return apiResponse(res,{
            statusCode:500,
            success:false,
            message:"issue delete failed",
            errors:getErrorMessage(error)
        })
    }
}
export const issueController = {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueByid,
    deleteIssueById
}