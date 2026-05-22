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

const getAllIssueFromDb = async (sort:string,type:string|undefined,status:string|undefined) =>{ 
     try {
         
        let query = `ORDER BY created_at DESC`;
        if(sort === 'oldest'){
            query = `ORDER BY created_at ASC`;
        }
        const issuesData = await pool.query(`
            SELECT * FROM issues ${query}
        `)
      
        const allIssues = issuesData.rows;
        
       

        let allIssueWithuser = await Promise.all(

            allIssues.map(async(issue)=>{
                const user = await finduserByid(issue.reporter_id);

                return {
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
            })
        )
        if(type &&  (type==="bug" || type === "feature_request")){
            allIssueWithuser = allIssueWithuser.filter((issue)=>{
               return issue.type === type;
            })
        }
        

        if(status && (status === 'open' || status === 'in_progress' || status === 'resolved')){
            allIssueWithuser = allIssueWithuser.filter((issue)=>{
               return issue.status === status;
            })
        }
      return allIssueWithuser;   

 
     } catch (error) {
         throw error
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
   
     } catch (error) {
         throw error
     }
    
 }
export const issueService = {
    createIssueIntoDb,
    getAllIssueFromDb,
    finduserByid
   
}
