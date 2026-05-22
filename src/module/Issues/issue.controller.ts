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

export const issueController ={
    createIssue,
}