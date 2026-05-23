import { pool } from "../../db"

export const issueTable = async () =>{
   try {
      await pool.query(`
           CREATE TABLE IF NOT EXISTS issues(
             id SERIAL PRIMARY KEY,
             title VARCHAR(150) NOT NULL,
             description TEXT NOT NULL,
              CHECK (LENGTH(description) >= 20),
             type TEXT NOT NULL, 
              CHECK(type IN('bug','feature_request')),
             status VARCHAR(20) DEFAULT 'open', 
              CHECK(status IN('in_progress','open','resolved')),
             reporter_id INT NOT NULL,
             created_at TIMESTAMP DEFAULT NOW(),
             updated_at TIMESTAMP DEFAULT NOW()
 
           )  
         `)
   } catch (error) {
      throw error
   }
}