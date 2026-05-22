import type { Request, Response } from "express"


type Tresponse<T> = {
    statusCode : number;
    success : boolean;
    message : string;
    data? : T ;
    errors? : unknown;
    
}
const apiResponse = <T>(res:Response,data:Tresponse<T>) => {
   return res.status(data.statusCode).
    json({
        success : data.success,
        message : data.message,
        data : data.data,
        errors : data.errors
    })
}

export default apiResponse;