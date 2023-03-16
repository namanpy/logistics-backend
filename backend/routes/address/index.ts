import express from "express";
import { Request, Response } from "express";
export const router : express.Router = express.Router();



router.post("/new", async (req : Request , res : Response, next : Function)  => {
        

        try {

                console.log('Working ', req.body.user.id);
                



        } catch(err) {

                next(err);

        }
}
);