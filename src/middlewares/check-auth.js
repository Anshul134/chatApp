const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    try {
    	const {token} = (req.method === "GET") ? req.query : req.body;
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userData = decoded;
        next();
    }
    catch( error ) {
        return res.send({status:401, message: "Unauthorized"});
    }
}