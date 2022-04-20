const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Import route
const authRoute = require('./route/auth');
const postRoute = require('./route/post');
const tenentRoute = require('./route/tenent');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
() => console.log('Connected to db!'));

//Middleware
//Body Parser
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);
app.use('/api/tenent', tenentRoute);



app.listen(3000,() => console.log('Server is running'));