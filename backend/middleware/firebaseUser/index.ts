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
    
    static async generateCustomToken(uid : string) : Promise<User> {
        try {
            const axios = require('axios');
            const customToken = await  getAuth().createCustomToken(uid);


            const res = await axios({
                url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`,
                method: 'post',
                data: {
                token: customToken,
                returnSecureToken: true
                },
                json: true,
            });
        
            return Promise.resolve(new User(uid, res.data.idToken));
      
        } catch (e) {
            throw e;
        }
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

