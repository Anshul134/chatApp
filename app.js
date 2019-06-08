const express = require('express');
const app = express();

const hbs = require('express-handlebars');
var NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const path = require('path');
const server = require('http').createServer(app);
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

// const io = require('socket.io').listen(server);

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: 'P-Sg8qAoDjaZsYZHt496GQ18UXJqiMogj05krArh-srK',
  url: 'https://gateway-lon.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-11-16'
});

var users = [];
var connections = [];

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
		if(data.emoticon) {
			io.sockets.emit('send message', data);
		}
		if(data.messageVal) {
			let options= {
				'text' : data.messageVal,
				features : {
					concepts: {},
	        keywords: {},
	        sentiment : {}
				}
			};
			nlu.analyze(options, function(err, res) {
	      if (err) {
	        console.log(err);
	        return;
	      }
	      let emotion = res.sentiment.document.score;
	      data.sentiScore = emotion;
	      delete data.messageVal;
	      io.sockets.emit('send message', data);
	      console.log("senti>>>>",res);
	    });
			
			io.sockets.emit('send message', data);
		}

	});

	socket.on('new img message', (data) => {
		if(data.imgSrc) {
			io.sockets.emit('new img message', data);
		}
	})



});


