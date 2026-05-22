import dotenv from 'dotenv'
import path from 'node:path'
import type {StringValue} from 'ms'

dotenv.config({
    path : path.join(process.cwd(),'.env')
})

const config ={
    port : process.env.PORT,
    connection_string : process.env.CONNECTION_STRING,
    jwt_secret : process.env.JWT_SECRET,
    jwt_validity_time : process.env.JWT_VALIDITY_TIME! as StringValue
    
}

export default config;