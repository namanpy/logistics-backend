import express from 'express';
import bodyParser from 'body-parser';
import { firebaseApp } from './backend/firebase';
import { Base } from "./backend/model/Base";


//Set up Express
const app : express.Application = express();
const cors = require("cors");
const portNumber : number  = 3000;


//Set Up Object Relation Model
Base.setFirebase(firebaseApp);

// Set parsing to JSON and use CORS
app.use(bodyParser.json()); 
app.use(cors());
 

