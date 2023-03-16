import { json } from "body-parser";
import joi from "joi";
import { ValidationResult } from 'joi';
import { Base } from "./Base";
import { CollectionReference, DocumentSnapshot, DocumentReference, WriteResult } from "@google-cloud/firestore";

export default class  Address  {

    id? : string;
    user? : string;
    fullName?  : string;
    phoneCode? : number;
    phoneNumber? : number;
    addressLine1? : string;
    addressLine2? : string;
    city? : string;
    state? : string;
    pincode? : string;
    country? : string;    
    
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

        fullName  : joi.string()
                       .min(3)
                       .max(30)
                       .required(),

        phoneCode : joi.number()
                       .min(10)
                       .max(999)
                       .required(),

        phoneNumber : joi.number()
                         .min(1000000000)
                         .max(9999999999)
                         .required(),

        addressLine1 : joi.string()
                          .min(2)
                          .max(100)
                          .required(),

        addressLine2 : joi.string()
                          .min(2)
                          .max(100)
                          .required(),
        
        city :  joi.string()
                   .min(2)
                   .max(100)
                   .required(),

        state : joi.string()
                    .min(2)
                    .max(100)
                    .required(),

        pincode :  joi.number()
                      .min(0)
                      .max(999999)
                      .required(),

        country : joi.string()
                     .min(2)
                     .max(100)
                     .required(), 

      });
      
      if(data) {
        const result : ValidationResult= this.schema.validate(data);
    
        if(result.error) {
          throw result.error;
        } else {

          this.user = data.user;
          this.fullName = data.fullName;
          this.phoneCode = data.phoneCode;
          this.phoneNumber = data.phoneNumber;
          this.addressLine1 =  data.addressLine1;
          this.addressLine2 =  data.addressLine2;
          this.city = data. city;
          this.state = data. state;
          this.pincode =  data.pincode;
          this.country = data.country;

        }

      }
      if (id) {
        this.id = id;
      }
    }
   
    async update(data : any) {

      const updateschema = joi.object({

        fullName  : joi.string()
                       .min(3)
                       .max(30),

        phoneCode : joi.number()
                       .min(10)
                       .max(999),

        phoneNumber : joi.number()
                         .min(1000000000)
                         .max(9999999999),

        addressLine1 : joi.string()
                          .min(2)
                          .max(100),

        addressLine2 : joi.string()
                          .min(2)
                          .max(100),
        
        city :  joi.string()
                   .min(2)
                   .max(100),

        state : joi.string()
                    .min(2)
                    .max(100),

        pincode :  joi.number()
                      .min(0)
                      .max(999999),

        country : joi.string()
                     .min(2)
                     .max(100), 

      });
      
      const result : ValidationResult= updateschema.validate(data);
    
      if(result.error) throw result.error;


      this.fullName = data.fullName ?  data.fullName : this.fullName ;
      this.phoneCode = data.phoneCode ?  data.phoneCode : this.phoneCode;
      this.phoneNumber = data.phoneNumber ?  data.phoneNumber : this.phoneNumber;
      this.addressLine1 = data.addressLine1 ?  data.addressLine1 : this.addressLine1;
      this.addressLine2 =  data.addressLine2 ?  data.addressLine2 : this.addressLine2;
      this.city = data.city ?  data.city : this.city;
      this.state = data.state ?  data.state : this.state;
      this.pincode =  data.pincode ?  data.pincode : this.pincode;
      this.country = data.country ?  data.country : this.country;

      this.save();
    }

    static setup(collectionName : string) {
    
      Address.collectionName = collectionName;
      Address.collection = Base.db.collection(this.collectionName);
      Address.isSetup = true;

    }

    static async getById(id : string) : Promise<Address> {

      const doc : DocumentSnapshot = await Address.collection.doc(id).get();

      if(!doc.exists) throw new Error("No Address exists with that Id.");

      return Promise.resolve(new Address(doc.data(), id));

    }
    
    static async removeById(id : string) : Promise<boolean> {

      const result : WriteResult = await Address.collection.doc(id).delete();
      return true;
    }

    async save() : Promise<string> {

      

      if(this.id) {
        //Update doc if Id exists
        Address.collection.doc(this.id).set(this.toJson());
        return this.id;
      }

      //Save as new Doc if Id doesn't exist
      const  doc : DocumentReference  = await Address.collection.add(this.toJson());

      this.id = doc.id;

      return Promise.resolve(doc.id);

    }


    toJson() : any {
      return {
      user         : this.user,
      fullName     : this.fullName,
      phoneCode    : this.phoneCode,
      phoneNumber  : this.phoneNumber,
      addressLine1 : this.addressLine1,
      addressLine2 : this.addressLine2,
      city    : this.city,
      state   : this.state,
      pincode : this.pincode,
      country : this.country
      }
    }


  
}

