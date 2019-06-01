const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.send("In /chats/");
});

module.exports = router;