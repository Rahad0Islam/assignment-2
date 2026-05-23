import config from "../../config/config";
import { pool } from "../../db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Iuser } from "./issue.interface";

const signupIntoDb = async (payload : Iuser) =>{
    try {
        const {name,email,password,role = "contributor"} = payload;
        const hashPassword = await bcrypt.hash(password,10);

        const result = await pool.query(`
           INSERT INTO users(name,email,password,role)
             VALUES($1,$2,$3,$4) RETURNING *
           
        `,[name,email,hashPassword,role]);
      
      delete result.rows[0].password;
      return result?.rows[0];
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "User signup failed";
        throw new Error(message)
    }
}

const loginDB = async (payload: Pick<Iuser,"email"|'password'>) =>{
    const {email , password } = payload;
    const emailCheck = await pool.query(`
        SELECT * FROM users WHERE email = $1  
        `,[email]);
        
        if(emailCheck.rows.length === 0){
            throw new Error ("Email does not exists");
        }
       

    const user = emailCheck.rows[0];
    const checkPassword = await bcrypt.compare(password,user.password);
    
    if(!checkPassword){
        throw new Error ("Incorrect Password");
    }
    delete user.password;

    const jwtPayload : Pick<Iuser,'id'|'name'|'role'>= {
        id : user.id,
        name : user.name,
        role : user.role
    }
    
    const jwt_secret = config.jwt_secret;
 
    const token = jwt.sign(jwtPayload , jwt_secret as string, { expiresIn: config.jwt_validity_time }) ;
    return {token,user};
    
}


export const authService = {
    signupIntoDb,
    loginDB,
}