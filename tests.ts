import Address from './backend/model/Address';
import { ValidationError } from 'joi';
import { firebaseApp } from './backend/firebase';
import { Base } from "./backend/model/Base";
Base.setFirebase(firebaseApp);



const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m"
    }
};

const success = (msg : string)=> {
    console.log(colours.bright, colours.bg.green, colours.fg.black, msg , colours.reset)
}
const error = (...msg : string[])=> {
    console.log(colours.bright, colours.bg.red, colours.fg.black, ...msg , colours.reset)
}



console.log("STEP 1")
try { new Address({ }); } 
catch (err : any) {
    if(err instanceof ValidationError) {} else { error("FAILED" ,  err.message) }
}
success("PASSED");

console.log("STEP 2")
try {
    new Address({
        user : 'uCJZLZ5w4oWMXmj30ibD62twQQN2',
        fullName  : "Naman Sharma",
        phoneCode : 91,
        phoneNumber : 9354479666,
        addressLine1 : "21 Jump Street",
        addressLine2 : "Windsor Apartments",
        city : "Ghaziabad",
        state : "Uttar Pradesh",
        pincode : 201010,
        country : "India",    
    });
}
catch (err : any) { error("FAILED" , err.message); }
success("PASSED");


console.log("STEP 3")
let addressId : string = '';
try {
    const addr : Address = new Address({
        user : 'uCJZLZ5w4oWMXmj30ibD62twQQN2',
        fullName  : "Naman Sharma",
        phoneCode : 91,
        phoneNumber : 9354479666,
        addressLine1 : "21 Jump Street",
        addressLine2 : "Windsor Apartments",
        city : "Ghaziabad",
        state : "Uttar Pradesh",
        pincode : 201010,
        country : "India",    
    });

    addr.save().then((id) => { 
        addressId = id;
        console.log(id);

        Address.getById(addressId)
        .then(
            (addrDoc) => {

                console.log(addrDoc.fullName)
                let addr2 : Address = addrDoc;

                addr2.fullName = "Karl Jacob";
                addr2.save()
                    .then()
                    .catch(err => { throw err; });

            }
        )
        .catch(err => { throw err; });

     }).catch(err => { throw err; });

}
catch (err : any) { error("FAILED" , err.message); }
success("PASSED");



console.log("STEP 4")

try {
 


}
catch (err : any) { error("FAILED" , err.message); }
success("PASSED");
