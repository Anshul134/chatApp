const express = require('express');
const router = express.Router();

//Middleware to check authorization
const checkAuth = require('../middlewares/check-auth');

const userController = require('../server-controller/user');
const chatController = require('../server-controller/chat');

const chatRouteData = require('../appDataObj').chat_routes;


/*| @Route /chats/
	| @Method GET
	| @Desc Fetch a list of all loggedin users 
	| @Inputs Inputs: JWT token 
	| @Ouptut Response : Object containing details of all loggedIn users
	| @Access Protected
*/
router.post(chatRouteData.CHAT_HOME, checkAuth, (req, res, next) => {
	console.log("in chats/")
	const {userName}= req.body;
	//Fetch List of online users
	chatController.fetchOnlineUsers()
				  .then( (results) => {
				  	console.log(results);	
				  	res.render('chatHome',{results, userName});	  	
				  }).catch( (err) => {
				  	 res.send(err);	
				  })	
	
});

router.post(chatRouteData.CHAT_ROOM, checkAuth, (req, res) => {
	let {myName, otherName} = req.body;	
	console.log("in /chatRoom")
	chatController.openRoom({myName, otherName})
				  .then( (result) => {
				  	res.send(result)
				  }).catch( (err) => {
				  	res.send(err);
				  })
})

module.exports = router;