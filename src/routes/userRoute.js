const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Users = require('../db/models/userModel');
const UserUtils = require('../db/dbUtils/userUtils');
const chatUtils = require('../db/dbUtils/chatUtils');

const CONFIG = require('../config/config');

//Contains route paths as strings
const userRouteData = require('../appDataObj').user_routes;

//Contains functions for user related server tasks like login, register, etc.
const userController = require('../server-controller/user');

/*| @Route /user/login
	| @Method POST
	| @Desc Login user 
	| @Inputs Inputs: email/username and password 
	| @Ouptut Response : JWT token
	| @Access Public
*/
router.post(userRouteData.LOGIN, (req, res) => {
	const {mailOrName, password} = req.body;
 	userController.userLogin(mailOrName, password)
 							  .then( (loginResults) => {
									if(loginResults.status === 200) {
										console.log(loginResults);
										res.send({loginResults});
									}
									else {
										res.send( {loginResults});
									}
								}).catch( (err) => {
									res.send( {err});
								})

});


/*| @Route /user/checkMail
	| @Method POST
	| @Desc Check if entered email is unique or not 
	| @Inputs Inputs: email
	| @Ouptut Response : true/false
	| @Access Public
*/
router.post(userRouteData.UNIQUE_MAIL, (req, res) => {
	const {email} = req.body;
	userController.checkMail(email)
								.then( (results) => {
									res.send(results);
								}).catch( (err) => {
									res.send(err);
								})
});


/*| @Route /user/checkName
	| @Method POST
	| @Desc Check if entered userName is unique or not 
	| @Inputs Inputs: userName
	| @Ouptut Response : true/false
	| @Access Public
*/
router.post(userRouteData.UNIQUE_NAME, (req, res) => {
	const {userName} = req.body;
	userController.checkName(userName)
								.then( (results) => {
									console.log(results);
									res.send(results);
								}).catch( (err) => {
									console.log(err);
									res.send(err);
								})
});


/*| @Route /user/register
	| @Method POST
	| @Desc Create new user 
	| @Inputs Inputs: email, username, fName, lName, password
	| @Ouptut Response : JWT token
	| @Access Public
*/
router.post(userRouteData.REGISTER, (req, res) => {
	const {email, password, userName, fName, lName} = req.body;
	userController.userRegister({email, password, userName, fName, lName})
								.then( (results) => {
									
									if(results.status === 200) {
										res.render('index',{results});
									}
									else {
										res.render('index', {results});
									}
								}).catch( (err) => {
									res.render('index', {err});
								})

});




//@Route /user/insert
//@Desc Insert user into collection
//@Acess Public
router.post('/insert', (req, res) => {
	const {email, userName, password, fName, lName} = req.body;
	const user = new Users({email, userName, password, fName, lName});
	UserUtils.insertUser({email, userName, password, fName, lName})
					 .then( (result) => {
					 		res.send({status : 200, result});
					 }).catch( (err) => {
					 		res.send({status:500, err});
					 })
});

module.exports = router;