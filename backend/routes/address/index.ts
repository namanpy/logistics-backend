import express from "express";
import { Request, Response } from "express";
import Address from "../../model/Address";
import joi from 'joi';

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
                                city: req.body.city,
                                state: req.body.state,
                                pincode: req.body.pincode,
                                country: req.body.country
                        }
                );
                await address.save();
                res.status(200).send({ id : address.id });


        } catch(err) {

                next(err);

        }
}
);

router.post('/delete', async (req : Request , res : Response, next : Function)  => { 
        try {

                const id : string = req.body.id;
                
                joi.assert(id, joi.string());

                const address : Address = await Address.getById(id);

                if(address.user != req.body.user.id) return res.status(400).send({ message : "Cannot delete other users address." });

                await Address.removeById(id);

                return res.status(200).send({ message : "Deleted." });         

        } catch(err) {
                next(err);
        }
}
);

router.post('/update', async (req : Request , res : Response, next : Function)  => { 
        try {


                const id : string = req.body.id;
                joi.assert(id, joi.string());
                const data = req.body;
                
                const address : Address = await Address.getById(id);

                if(address.user != req.body.user.id) return res.status(400).send({ message : "Cannot update other users address." });

                await address.update(data);
                
                return res.status(200).send({ message : "Updated." });         

        } catch(err) {
                next(err);
        }
}
);