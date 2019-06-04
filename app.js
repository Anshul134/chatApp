const express = require('express');
const app = express();

const hbs = require('express-handlebars');

const path = require('path');
var server=require('http').createServer(app);
const io = require('socket.io').listen(server);

//USING .env file for enviroment variables
require('dotenv').config();

app.use('/assets', express.static(path.join(__dirname ,'public') ));

app.set('view engine', 'handlebars');
app.engine( 'handlebars', hbs({
  extname: 'handlebars',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helper : __dirname + '/src/client-controller/utils'
}));


const userRoute = require('./src/routes/userRoute');
const chatRoute = require('./src/routes/chatRoute');
const appRoutes = require('./src/routes/appRoutes');
const PORT = process.env.PORT;


const db = require('./src/db/config.js');

app.use(express.json());
app.use(express.urlencoded({extended:false}) );

app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use('/', appRoutes);

server.listen(PORT, () => {
	console.log(`Listening to ${PORT}`);
});

let users = [];
let connections = [];

io.sockets.on('connection', (socket) => {
	connections.push(socket);
	console.log("connected ", connections.length, " sockets");

	socket.on('disconnect', (data) => {
		console.log("socket username:::::::", socket.userName)
		users.splice( users.indexOf(socket.userName), 1);
		updateUserNames();
		connections.splice( connections.indexOf(socket), 1);
		console.log("Disconnected ", connections.length, " sockets still connected");		
	});

	socket.on('send message', (data) => {
		io.sockets.emit('send message', {msg: data});
	});

	socket.on('new user', (data, callback) => {
		console.log("new user>>>>",data)
		callback({status:true, pageVisits : parseInt(data.pageVisits)+1});
		socket.userName = data.userName;
		users.push(socket.userName);
		updateUserNames();
	});

	socket.on('get users', (callback) => {
		console.log("::::::FETCH USER::::");
		callback();
		updateUserNames();
	})

	const updateUserNames = () => {
		console.log("IN HERE::::::::", users);
		io.sockets.emit('get usernames', users);
	}

	socket.on('new message', (data) => {
		console.log("DATA::::",data);
		io.sockets.emit('send message', data);
	});



});


