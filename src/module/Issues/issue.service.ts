import { pool } from "../../db";
import type { Issues, IussueWithuser } from "./issue.interface";


const createIssueIntoDb = async (payload:Issues , reporter_id : number) =>{
    try {

        const {title,description,type} = payload;

        const result = await pool.query(`
            INSERT INTO issues (title,description,type,reporter_id)
             VALUES($1,$2,$3,$4) RETURNING *
        `,[title,description,type,reporter_id]);

        return result;
    } catch (error: unknown) {
        throw error;
    }
}

const getAllIssueFromDb = async (sort:string) =>{ 
     try {
         
        let query = `ORDER BY created_at DESC`;
        if(sort === 'oldest'){
            query = `ORDER BY created_at ASC`;
        }
        const issuesData = await pool.query(`
            SELECT * FROM issues ${query}
        `)
      
        const allIssues = issuesData.rows;
        
    
      return allIssues;
    }catch(error){
        throw error;
    }
}

const allIssueWithuser = async (allIssues:Issues[]) : Promise<IussueWithuser[]> =>{
    try {
         let allIssueWithuser = await Promise.all(
    
                allIssues.map(async(issue)=>{
                    const user = await finduserByid(issue.reporter_id as number);
    
                    return {
                        id: issue.id as number,
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
                })
            )
    
          return allIssueWithuser;
    } catch (error) {
        throw error;
    }
}

 const finduserByid = async(id:number) =>{
     try {
         if(!id){
           throw new Error("id is not valid");
         }
   
         const result = await pool.query(`
             SELECT id,name,role from users WHERE id = $1
       `,[id]);

       if(result.rows.length === 0){
         throw new Error("user not found ");
       }
       return result.rows[0];
   
     } catch (error: unknown) {
         throw error
     }
    
 }

 const getIssueByidFromDb = async (id: number) =>{
      try {
         const result =await pool.query(`
             SELECT * FROM issues WHERE id = $1
        `,[id]);
        
        // if(result.rows.length === 0){
        //     throw new Error("issue not found");
        // }
        const issue = result?.rows[0];
         
        return issue;
       
        } catch (error: unknown) {
            throw error
      }
 }


  const updateIssueByidIntoDb = async (id: number , payload :Issues) =>{
        try {
          
        const {title,description,type} =payload;

        const updateIssue = await pool.query(`
            UPDATE issues SET 
               title = COALESCE($1,title),
               description = COALESCE($2,description),
               type = COALESCE($3,type),
               updated_at = NOW()
            WHERE id = $4  RETURNING *
        `,[title,description,type,id])

        return updateIssue.rows[0];
        
        } catch (error: unknown) {
            throw error;
        }
  }


  const deleteIssueFromDb = async(id:number)=>{
       try {
        
        await pool.query(`
            DELETE FROM issues WHERE ID = $1
        `,[id]);
             } catch (error: unknown) {
                 throw error
       }
  }

export const issueService = {
    createIssueIntoDb,
    getAllIssueFromDb,
    getIssueByidFromDb,
    updateIssueByidIntoDb,
    finduserByid,
    deleteIssueFromDb,
    allIssueWithuser,
}
