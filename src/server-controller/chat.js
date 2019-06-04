const Users = require('../db/models/userModel');
const loggedInUser = require('../db/models/loggedInModel');

const UserUtils = require('../db/dbUtils/userUtils');
const chatUtils = require('../db/dbUtils/chatUtils');

const CONFIG = require('../config/config');

const MESSAGES = require('../appDataObj').message;


const fetchDetails = (user) => {
	return new Promise( (resolve, reject) => {
		UserUtils.fetchDetails({userName : user.userName})
						 .then( (userDetails) => {
						 		resolve(userDetails);
						 }).catch( (err) => {
						 		reject(err);
						 })
	});					 
}


module.exports = {
	openRoom : (userData) => {
		
			return new Promise( (resolve, reject) => {
				console.log("reached", userData)
					let userNames = [];

					for( let user in userData) {
						userNames.push(userData[user]);
					}
					let onlinePromise = userNames.map( (user) => {
						
						return chatUtils.checkLoggedIn({userName:user});
					})
					Promise.all(onlinePromise)
								 .then( (results) => { 
								 		console.log("results",results);
								 		if(results.indexOf("false") === -1) {
								 			resolve({status : 200, online:true});
								 		}
								 		else {
								 			resolve({status : 200, online:false});
								 		}
								 }).catch( (err) => {
								 	console.log(err);
								 	reject(err)
								 })
			});	
	},
	fetchOnlineUsers : () => {
		
		return new Promise( (resolve, reject) => {
			UserUtils.fetchOnlineUsers()
							 .then( (users) => {
							 		let userObj = [];
							 		users.forEach( (user) => {
							 			fetchDetails(user)
							 				.then( (userDetails) => {
							 					userObj.push(userDetails);
							 					if(userObj.length === users.length) {
							 						resolve(userObj);
							 					}
							 				}).catch( (err) => {
							 					reject(err);
							 				})
							 		});
							 		
							 }).catch( (err) => {
							 	reject(err);
							 })
		});
	}
};