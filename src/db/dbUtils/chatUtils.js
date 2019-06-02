const Users = require('../models/userModel');
const LoggedInUser = require('../models/loggedInModel');

module.exports = {
	checkLoggedIn : ({userName}) => {
			console.log("In util",userName)
			return new Promise( (resolve, reject) => {
				LoggedInUser.findOne({userName})
							.then( (data) => {
									if(!data || data.length===0) 
										resolve(false);
									else 
										resolve(true);	
							}).catch( (err) => {
									reject(err);
							});
			});
	},
}