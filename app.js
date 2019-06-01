const express = require('express');
const app = express();

//USING .env file for enviroment variables
require('dotenv').config();

const userRoute = require('./src/routes/userRoute');
const chatRoute = require('./src/routes/chatRoute');

const PORT = process.env.PORT;

const db = require('./src/db/config.js');

app.use(express.json());
app.use(express.urlencoded({extended:false}) );

app.use('/user', userRoute);
app.use('/chats', chatRoute);

app.listen(PORT, () => {
	console.log(`Listening to ${PORT}`);
});
