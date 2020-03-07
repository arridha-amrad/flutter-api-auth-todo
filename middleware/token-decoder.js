const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
module.exports = function(req, res, next) {
	// Get token from header
	const token = req.header("user-token");

	// Check if not token
	if (!token) {
		return res
			.status(401)
			.json({ msg: "You need to login to access this page" });
	}

	try {
		const decoded = jwt.verify(token, SECRET);
		// console.log(decoded);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};
