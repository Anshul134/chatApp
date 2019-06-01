const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	userName : {
		type : String,
		required : true,
		unique : true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	fName : String,
	lName : String,
	password : String
});

module.exports = mongoose.model('users', schema);