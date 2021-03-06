const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');



//Import route
const authRoute = require('./src/route/auth');
const userRoute = require('./src/route/user');
const tenantRoute = require('./src/route/tenant');


dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
() => console.log('Connected to db!'));

//Middleware
//Body Parser
app.use(express.json());

//Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/tenant', tenantRoute);



app.listen(3000,() => console.log('Server is running'));