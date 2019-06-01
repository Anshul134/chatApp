const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Users = require('../db/models/userModel');
const UserUtils = require('../db/dbUtils/userUtils');

const CONFIG = require('../config/config');

const MESSAGES = require('../appDataObj').message;


const users = {
	userLogin : (mailOrName, password) => {
		return new Promise( (resolve, reject) => {
			UserUtils.findMailorName(mailOrName)
		 					 .then( (user) => {   //.then #1
			 						if(!user || user.length === 0) {
			 							resolve({status:400, message : MESSAGES.USER_NOT_FOUND});
		 							}
			 						const data = user[0];
			 						bcrypt.compare(password, data.password)
			 								  .then( (result) => {  		 //.then #2
			 								  		if(result) {
			 								  			const token = jwt.sign({
			 								  				userName : data.userName,
			 								  				userEmail : data.email,
			 								  			}, CONFIG.JWT_SECRET);
			 								  			resolve({status:200, token});
			 								  		} else {
			 								  			resolve( {status:400, message: MESSAGES.WRONG_CREDS});
			 								  		}
			 								  }).catch ( (err) => {  // catch block for .then #2
			 								  	reject({status:500, message: MESSAGES.SOMETHING_WRONG});
			 								  });
			 					}).catch( (err) => { 	//catch block for .then #1
			 						reject({err});
			 					});
	 		});
	},
	checkMailOrName : (data) => {		//data is either email or userName depending.
		return new Promise( (resolve, reject) => {
			 UserUtils.findMailorName(data)
			 			.then( (result) => { 	//.then #3
			 				console.log("RESULTS", result);
			 					if(!result || result.length === 0) {	//Woud mean that data is unique
			 						resolve({status:200, emailExist : true})
			 					} else {															//Woud mean that data is not unique
			 						resolve({status:400, emailExist : false});
			 					}
			 			}).catch( (err) => {	//catch block for .then #3
			 					console.log("error", err);
			 					reject({status : 500, message : MESSAGES.SOMETHING_WRONG})
			 			})
		});
	},
	userRegister : (data) => {
		console.log("body",data);
		return new Promise( (resolve, reject) => {
			const {email, password, userName, fName, lName} = data;
			console.log("INDIVIDUAL>>>", email, password, userName, fName, lName);
			/*Since uniqueness of email & userName is checked at front-end, I have not implemented those functionalities in back-end. However, they can be implemented using functionality similiar to UserUtils.findMailorName() */

			let body = {};
			let hashPassword = '';
			bcrypt.hash(password, 10)
					  .then( (hash) => {		//.then #4
					  		body.email = email,
					  		body.password = hash,
					  		body.userName = userName,
					  		body.fName = fName,
					  		body.lName = lName,
					  		UserUtils.insertUser(body)
												 .then( (results) => { 		//.then #5
												 		if(results) {
												 			const token = jwt.sign({
												 				userName : body.userName,
												 				userEmail : body.email,
												 			}, CONFIG.JWT_SECRET);
												 			resolve({status:200, token});
												 		}
												 		
												 }).catch( (err) => { 		//catch block for .then #5
												 		reject({status:500, message: MESSAGES.SOMETHING_WRONG});
												 })
					  }).catch( (err) => {		//catch block for .then #4
					  	console.log(err);
					  	reject({status:500, message: MESSAGES.SOMETHING_WRONG});
					  })
			
		});
	},
};

module.exports = users;