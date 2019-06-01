const Users = require('../models/userModel');

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
}