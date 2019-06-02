const mongoose = require('mongoose');
const Users = require('./userModel');


const schema = new mongoose.Schema({
	userName : {
		type: String,
		required: true,
		unique : true,
		ref : Users
	}
});

module.exports = mongoose.model('loggedInUsers', schema);