import { json } from "body-parser";
import joi, { alternatives } from "joi";
import { ValidationResult } from 'joi';
import { Base } from "./Base";
import { CollectionReference, QuerySnapshot, DocumentSnapshot, DocumentReference, WriteResult, Timestamp } from "@google-cloud/firestore";
import { timeStamp } from "console";

export default class  Order  {

    id? : string;
    user? : string;
    from? : string;
    from_lat? : number;
    from_long? : number;
    to? : string;
    to_lat? : number;
    to_long? : number;
    status? : number;
    createdAt? : Date;
    updatedAt? : Date;
    cost? : number;
    distance? : number;
    vehicleId? : string; 
    
    schema : joi.Schema;

    static collectionName : string;
    static collection : CollectionReference;
    static isSetup : boolean = false;

    constructor(
      data?  : any,
      id? : string
    ) {
    

      this.schema = joi.object({

        user : joi.string()
                  .alphanum()
                  .min(1)
                  .max(30)
                  .required(),


        from : joi.string()
                  .min(1)
                  .max(300)
                  .required(),
  
        from_lat : joi.number()
                    .required(),
  
        from_long : joi.number()
                     .required(),

        to : joi.string()
                .min(1)
                .max(300)
                .required(),

        to_lat : joi.number()
                    .required(),

        to_long : joi.number()
                     .required(),

        status : joi.number()
                    .custom((value, helper) => {
                      
                      if(![1, 2, 3, 4, 5].includes(value)) {
                        return helper.message({ custom : "Not a Valid Status." });
                      }

                      return true;

                    }),
        
        createdAt :  joi.date(),

        updatedAt : joi.date(),

        cost :  joi.number()
                      .min(0)
                      .max(999999999)
                      .required(),
        distance :  joi.number()
                      .min(0)
                      .max(999999999)
                      .required(),

        vehicleId : joi.string()
                     .min(1)
                     .max(100)
                     .required() 

      });
      
      if(data) {
        if (id) {
          this.id = id;
          data.createdAt = data.createdAt.toDate();
          data.updatedAt = data.updatedAt.toDate();
      
          this.createdAt =  new Date(data.createdAt);
          this.updatedAt =  new Date(data.updatedAt);
          console.log(this.createdAt)
        }
        else {
          this.createdAt = new Date();
          this.updatedAt =  new Date();
        }
        const result : ValidationResult= this.schema.validate(data);
    
        if(result.error) {
          throw result.error;
        } else {

          this.user = data.user;
          this.from = data.from;
          this.from_lat = data.from_lat;
          this.from_long = data.from_long;
          this.to = data.to;
          this.to_lat = data.to_lat;
          this.to_long = data.to_long;
          this.status = data.status;
          this.cost = data.cost;
          this.distance = data.distance;
          this.vehicleId = data.vehicleId;

        }

      }
      if (id) {
        this.id = id;
      }

    }
   
    async update(data : any) {

      const updateschema = joi.object({

        from : joi.string()
                  .min(1)
                  .max(300)
                  ,
  
        from_lat : joi.number()
                    ,
  
        from_long : joi.number()
                    ,

        to : joi.string()
                .min(1)
                .max(300)
                ,

        to_lat : joi.number()
                    ,

        to_long : joi.number()
                    ,

        status : joi.number()
                    .custom((value, helper) => {
                      
                      if(![1, 2, 3, 4, 5].includes(value)) {
                        return helper.message({ custom : "Not a Valid Status." });
                      }

                      return true;

                    }),
        
        createdAt :  joi.date(),

        updateAt : joi.date(),

        cost :  joi.number()
                      .min(0)
                      .max(999999999)
                      ,
        distance :  joi.number()
                      .min(0)
                      .max(999999999)
                      ,

        vehicleId : joi.string()
                     .min(1)
                     .max(100)
                      

      });
      
      const result : ValidationResult= updateschema.validate(data);
    
      if(result.error) throw result.error;


      // this.fullName = data.fullName ?  data.fullName : this.fullName ;
      // this.phoneCode = data.phoneCode ?  data.phoneCode : this.phoneCode;
      // this.phoneNumber = data.phoneNumber ?  data.phoneNumber : this.phoneNumber;
      // this.orderLine1 = data.orderLine1 ?  data.orderLine1 : this.orderLine1;
      // this.orderLine2 =  data.orderLine2 ?  data.orderLine2 : this.orderLine2;
      // this.city = data.city ?  data.city : this.city;
      // this.state = data.state ?  data.state : this.state;
      // this.pincode =  data.pincode ?  data.pincode : this.pincode;
      // this.country = data.country ?  data.country : this.country;

      this.from = data.from ? data.from : this.from;
      this.from_lat = data.from_lat ? data.from_lat : this.from_lat;
      this.from_long = data.from_long ? data.from_long : this.from_long;
      this.to = data.to ? data.to : this.to;
      this.to_lat = data.to_lat ? data.to_lat : this.to_lat;
      this.to_long = data.to_long ? data.to_long : this.to_long;
      this.status = data.status ? data.status : this.status;
      this.createdAt = data.createdAt ? data.createdAt : this.createdAt;
      this.updatedAt =  data.updatedAt ? data.updatedAt : this.updatedAt;
      this.cost = data.cost ? data.cost : this.cost;
      this.distance = data.distance ? data.distance : this.distance;
      this.vehicleId = data.vehicleId ? data.vehicleId : this.vehicleId;

      this.save();
    }

    static setup(collectionName : string) {
    
      Order.collectionName = collectionName;
      Order.collection = Base.db.collection(this.collectionName);
      Order.isSetup = true;

    }

    static async getById(id : string) : Promise<Order> {

      const doc : DocumentSnapshot = await Order.collection.doc(id).get();

      if(!doc.exists) throw new Error("No Order exists with that Id.");

      return Promise.resolve(new Order(doc.data(), id));

    }
    
    static async removeById(id : string) : Promise<boolean> {

      const result : WriteResult = await Order.collection.doc(id).delete();
      return true;
    }


    static async getAll(user : string) : Promise<Order[]> {

      const orders : Order[] = [];
      const querydocs : QuerySnapshot = await Order.collection.where("user" , "==" , user).orderBy("createdAt").get();

      for( let i in querydocs.docs) {

        orders.push(new Order(querydocs.docs[i].data()));

      }
      return Promise.resolve(orders);
    }

    async save() : Promise<string> {

      

      if(this.id) {
        //Update doc if Id exists
        Order.collection.doc(this.id).set(this.__toJson());
        return this.id;
      }

      //Save as new Doc if Id doesn't exist
      const  doc : DocumentReference  = await Order.collection.add(this.__toJson());

      this.id = doc.id;

      return Promise.resolve(doc.id);

    }

    __toJson() : any {
      return {
        user : this.user,
        from : this.from,
        from_lat : this.from_lat,
        from_long : this.from_long,
        to : this.to,
        to_lat : this.to_lat,
        to_long : this.to_long,
        status : this.status,
        createdAt : Timestamp.fromDate(this.createdAt ? this.createdAt : new Date()),
        updatedAt :  Timestamp.fromDate(new Date()),
        cost : this.cost,
        distance : this.distance,
        vehicleId : this.vehicleId
      }
    }
    toJson() : any {
      return {
        user : this.user,
        from : this.from,
        from_lat : this.from_lat,
        from_long : this.from_long,
        to : this.to,
        to_lat : this.to_lat,
        to_long : this.to_long,
        status : this.status,
        createdAt : this.createdAt?.toDateString(),
        updatedAt :  this.updatedAt?.toDateString(),
        cost : this.cost,
        distance : this.distance,
        vehicleId : this.vehicleId
      }
    }


  
}

