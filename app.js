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

let socketConn = [];

io.sockets.on('connection', (socket) => {
	socketConn.push(socket);

	console.log("connected", socketConn.length, socket.id);
	
	socket.on('user authed', (data, callback) => {
		callback(true);
		socket.userName = data.userName;
		let socketList = socketConn.filter( (socketConn) => {
			socketConn.id !== socket.id;
		});
		socketConn = socketList;
		socketConn.push( socket );
	})

	socket.on('disconnect', () => {
		let socketList = socketConn.filter( (socketConn) => {
			socketConn.id !== socket.id;
		});
		socketConn = socketList;
		console.log("Disconnected")
	});

	
});



