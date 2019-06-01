const CONFIG = require("../config/config.json");
const mongoose = require('mongoose');
const dbUrl = CONFIG.DB_URL;

const db= mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
	if(err)
		console.log("error", err);
});

module.exports = db;