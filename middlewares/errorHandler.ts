import { Status, Middleware } from "https://deno.land/x/oak/mod.ts";
import RequestError from "../utils/requestError.ts";

const errorHandler: Middleware = async (context, next) => {
    try {
        await next();
    } catch(err){
        if (err as RequestError) {
            context.response.status = err.status
            context.response.body = {
                success: false,
                message: err.message
            };
            
        } else {
            context.response.status = Status.InternalServerError;
            context.response.body = {
                success: false,
                message: 'Internal Server Error'
            };
        }
    }
}

export default errorHandler;