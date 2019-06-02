const Users = require('../models/userModel');
const LoggedInUser = require('../models/loggedInModel');

module.exports = {
	findMailorName : (body) => {
		return new Promise( (resolve, reject) => {
			Users.find({
				$or : [ {email : body}, {userName : body}]
			}).then( (res) => {
				if(res.length) {
					resolve(res);
				} else {
					resolve(res);
				}
			}).catch( (err) => {
				reject(err);
			})
		});
	},
	insertUser : (body) => {
		return new Promise( (resolve, reject) => {
			const user = new Users(body);
			user.save()
				.then( (res) => {
					resolve(res);
				}).catch( (err) => {
					reject(err);
				});
		});
	},
	insertLogIn : ({userName}) => {
		return new Promise( (resolve, reject) => {
				const newLogin = new  LoggedInUser({userName});
				newLogin.save()
						.then( (result) => {
								resolve(result);
						}).catch( (err) => {
							reject(err);
						})
		});
	},
	fetchOnlineUsers : () => {
		return new Promise( (resolve, reject) => {
			LoggedInUser.find()
						.then( (results) => {
							resolve(results);
						}).catch( (err) => {
							reject(err);
						})
		})
	},
	fetchDetails : (userName) => {
		return new Promise( (resolve, reject) => {
			Users.findOne({userName : userName.userName})
				 .then( (user) => {
				 	resolve(user);
			 	}).catch( (err) => {
			 		reject(err);
			 	})
		})
	}
}