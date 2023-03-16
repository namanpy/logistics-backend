import express from 'express';
import bodyParser from 'body-parser';
import { firebaseApp } from './backend/firebase';
import { Base } from "./backend/model/Base";

//Import Middlewares
import errorMiddleware  from './backend/middleware/error';
import { User, userMiddleware } from './backend/middleware/firebaseUser';

//Import Routers
import { router as addressRouter } from './backend/routes/address';




//Set up Express
const app : express.Application = express();
const cors = require("cors");
const portNumber : number  = 3000;


//Set Up Object Relation Model
Base.setFirebase(firebaseApp);

// Set parsing to JSON and use CORS
app.use(bodyParser.json()); 
app.use(cors());
app.use(errorMiddleware);

User.generateCustomToken('uCJZLZ5w4oWMXmj30ibD62twQQN2');


app.use("/address", userMiddleware, addressRouter);

