import { ValidationError } from 'joi';
import { Response, Request } from 'express';
export default function errorMiddleware(err : Error, req : Request, res : Response, next : Function) {

    if(err instanceof ValidationError) return res.status(400).send( { message : err.message } );
    
    return res.status(500).send( { message : err.message } );

}