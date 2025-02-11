const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
 // Check if user is authenticated
 if (req.session.authorization) {
    let token = req.session.authorization['accessToken']; // Access Token
    
    // Verify JWT token for user authentication
    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            req.user = user; // Set authenticated user data on the request object
            next(); // Proceed to the next middleware
        } else {
            return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
        }
    });
    
    // Return error if no access token is found in the session
} else {
    return res.status(403).json({ message: "User not logged in" });
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
