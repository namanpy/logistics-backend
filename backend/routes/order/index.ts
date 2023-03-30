import express from "express";
import { Request, Response } from "express";
import Order from "../../model/Order";
import joi from 'joi';

export const router : express.Router = express.Router();



router.post("/new", async (req : Request , res : Response, next : Function)  => {
        

        try {

                const order = new Order(
                        {
                                user : req.body.user.id,
                                from : req.body.from,
                                from_lat : req.body.from_lat,
                                from_long : req.body.from_long,
                                to : req.body.to,
                                to_lat : req.body.to_lat,
                                to_long : req.body.to_long,
                                status : req.body.status,
                                cost : req.body.cost,
                                distance : req.body.distance,
                                vehicleId : req.body.vehicleId
                        }
                );
                await order.save();
                res.status(200).send({ id : order.id });


        } catch(err) {

                next(err);

        }
}
);

router.post('/delete', async (req : Request , res : Response, next : Function)  => { 
        try {

                const id : string = req.body.id;
                
                joi.assert(id, joi.string());

                const order : Order = await Order.getById(id);

                if(order.user != req.body.user.id) return res.status(400).send({ message : "Cannot delete other users order." });

                await Order.removeById(id);

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
                
                const data = JSON.parse(JSON.stringify(req.body));
                delete data.token;
                delete data.user;
                delete data.id;


                const order : Order = await Order.getById(id);

                if(order.user != req.body.user.id) return res.status(400).send({ message : "Cannot update other users order." });

                await order.update(data);
                
                return res.status(200).send({ message : "Updated." });         

        } catch(err) {
                next(err);
        }
}
);


router.post('/getall', async (req : Request , res : Response, next : Function)  => { 
        try {

                const order : Order[] = await Order.getAll(req.body.user.id);
                const serializedOrders : any = [];
                for(let i in order) {
                        serializedOrders.push(order[i].toJson());
                }
                
                return res.status(200).send(serializedOrders);         

        } catch(err) {
                next(err);
        }
}
);