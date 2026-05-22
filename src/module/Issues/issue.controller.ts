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
const getIssueById = async (req:Request , res: Response) =>{
     try {
        const id= Number(req?.params?.id);
        const issue  = await issueService.getIssueByidFromDb(id);

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
     } catch (error) {
         throw error
     }
}

const updateIssueByid = async (req:Request , res: Response) =>{
    try {
       
        const IssueId = Number( req.params.id );
        const id = req.user?.id;
        const issue  = await issueService.getIssueByidFromDb(IssueId);
        const userId = issue?.reporter_id;
        const role = req.user?.role;
        // console.log({role});
        if((id === userId && issue.status === 'open')|| role === 'maintainer'){
            const result = await issueService.updateIssueByidIntoDb(IssueId ,req.body);
        
           return apiResponse(res,{
              statusCode:200,
              success:true,
              message:"Issue updated successfully",
              data:result
           });
            
        }
        else{
          return  apiResponse(res,{
                statusCode:403,
                success:false,
                message:"not permission to update issue",
                data:{}
            })
        }

    } catch (error) {
        throw error
    }
}


export const issueController ={
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueByid
}