import { pool } from "../../db"

export const authTable = async()=>{
   try {
     await pool.query(`
               CREATE TABLE IF NOT EXISTS users (
                 id SERIAL PRIMARY KEY,
                 name TEXT  NOT NULL,
                 email VARCHAR(255) UNIQUE NOT NULL ,
                 password TEXT NOT NULL,
                 role TEXT DEFAULT 'contributor',
                  CHECK (role IN ('contributor', 'maintainer')),
                 created_at TIMESTAMP DEFAULT NOW(),
                 updated_at TIMESTAMP DEFAULT NOW()
               )    
           `)
   } catch (error) {
      throw error;
   }
}
        