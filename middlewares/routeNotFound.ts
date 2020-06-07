import { Status, Middleware } from "https://deno.land/x/oak/mod.ts";
import RequestError from "../utils/requestError.ts";

const routeNotFound: Middleware = (context) => {
    const error = new Error('API not found') as RequestError;
    error.status = 404;
    throw error;
}

export default routeNotFound;