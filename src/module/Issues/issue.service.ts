import { pool } from "../../db";
import type { Issues } from "./issue.interface";


const createIssueIntoDb = async (payload:Issues , reporter_id : number) =>{
    try {

        const {title,description,type} = payload;

        const result = await pool.query(`
            INSERT INTO issues (title,description,type,reporter_id)
             VALUES($1,$2,$3,$4) RETURNING *
        `,[title,description,type,reporter_id]);

        return result;
    } catch (error) {
        throw error;
    }
}


export const issueService = {
    createIssueIntoDb,
   
}
