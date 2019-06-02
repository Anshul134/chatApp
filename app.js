const express = require('express');
const app = express();

const hbs = require('express-handlebars');

const path = require('path');

const socket = require('socket.io');

//USING .env file for enviroment variables
require('dotenv').config();

app.use('/assets', express.static(path.join(__dirname ,'public') ));

app.set('view engine', 'handlebars');
app.engine( 'handlebars', hbs({
  extname: 'handlebars',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));


const userRoute = require('./src/routes/userRoute');
const chatRoute = require('./src/routes/chatRoute');

const PORT = process.env.PORT;

const db = require('./src/db/config.js');

app.use(express.json());
app.use(express.urlencoded({extended:false}) );

app.use('/user', userRoute);
app.use('/chats', chatRoute);

const server = app.listen(PORT, () => {
	console.log(`Listening to ${PORT}`);
});

