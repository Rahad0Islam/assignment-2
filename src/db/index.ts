import {Pool} from 'pg'
import config from '../config/config'
import { authTable } from '../module/Authentication/auth.table'
import { issueTable } from '../module/Issues/issue.table'

const pool = new Pool({
    connectionString:config.connection_string
})

const  initDB = async () =>{
    try {
      
      await authTable();
      await  issueTable();

        console.log(`database connected successfully`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log(error)
      }
      process.exit(1); // stop  application
    }
}


export {
    pool,
    initDB,
}