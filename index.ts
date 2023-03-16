import express from 'express';
import bodyParser from 'body-parser';
import { firebaseApp } from './backend/firebase';
import { Base } from "./backend/model/Base";
import * as dotenv from 'dotenv';


//Import Middlewares
dotenv.config();
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



app.use("/address", userMiddleware, addressRouter);

app.listen(3000, () => {
    User.generateCustomToken('uCJZLZ5w4oWMXmj30ibD62twQQN2').then(
        (user : User) => {
            console.log("Custom generated token -> ", user.token);
        }  
    ).catch(err => console.error(err));

    console.log()
    console.log(`Listening on port 3000`);
})