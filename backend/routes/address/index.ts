import express from "express";
import { Request, Response } from "express";
import Address from "../../model/Address";
export const router : express.Router = express.Router();



router.post("/new", async (req : Request , res : Response, next : Function)  => {
        

        try {

                const address = new Address(
                        {
                                user : req.body.user.id,
                                fullName: req.body.fullName,
                                phoneCode: req.body.phoneCode,
                                phoneNumber: req.body.phoneNumber,
                                addressLine1: req.body.addressLine1,
                                addressLine2: req.body.addressLine1,
                                city: req.body.addressLine1,
                                state: req.body.addressLine1,
                                pincode: req.body.addressLine1,
                                country: req.body.addressLine1
                        }
                );
                await address.save();
                res.status(200).send(address.toJson());


        } catch(err) {

                next(err);

        }
}
);