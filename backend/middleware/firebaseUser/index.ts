import { Request, Response } from "express";
import { firebaseApp } from '../../firebase';
import { getAuth , DecodedIdToken} from "firebase-admin/auth";
export class User {

    token? : string;
    id : string;
    phoneNumber? : string;

    constructor(id : string, token? : string) {
        this.token = token;
        this.id = id;
    }
    
    static async generateCustomToken(uid : string) {
        const token : string = await getAuth().createCustomToken(uid);

        return Promise.resolve(new User(uid, token));
        
    }
}

export async function userMiddleware(req : Request, res : Response, next : Function) {

    const token = req.body.token;

    if(!token) return next(new Error("Token not specified."));

    try {
        
        const decodedToken : DecodedIdToken = await getAuth().verifyIdToken(token);
        req.body.user = new User(decodedToken.uid, token);
        next();

    } catch(err) {
        next(err);
    }
}

