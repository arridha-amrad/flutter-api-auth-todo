const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const messages = require("../email/client-messages");
const sendEmail = require("../email/send-provider");
const emailTemplates = require("../email/email-templates");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const {
	validateLogin,
	validateSignup,
	validateResetPasswordRequest,
	validateResetPassword
} = require("../middleware/inputValidator");
const auth = require("../middleware/token-decoder");

// signup user
router.post("/signup", async (req, res) => {
	let { username, email, password } = req.body;
	// validate user input
	const { errors, valid } = validateSignup(username, email, password);
	if (!valid) {
		return res.status(400).json({ err: errors });
	}
	try {
		// find user inside database
		const user = await User.findOne({ email });
		// is user already exist
		if (user && user.confirmed === true) {
			return res.status(400).json({ err: "User already exists" });
		}
		// is user already exist but confirmed false
		if (user && user.confirmed === false) {
			return res.status(400).json({ err: "Please confirm your email" });
		}
		// hash password
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		// generate link
		const link = await jwt.sign(
			{
				email,
				username
			},
			SECRET,
			{ expiresIn: "7d" }
		);
		const newUser = new User({
			username,
			email,
			password,
			createdAt: new Date(),
			link
		});
		const result = await newUser.save();
		await sendEmail(
			result.email,
			emailTemplates.emailConfirmation(result.username, result.link)
		);
		return res.status(200).json({
			msg: messages.confirm(result.email)
		});
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.get("/confirm/:link", async (req, res) => {
	const { link } = req.params;
	try {
		// find user with the link
		const user = await User.findOne({ link });
		// no user
		if (!user) {
			return res.status(400).json({ err: "Invalid link" });
		}
		// user already confirmed
		if (user && user.confirmed === true) {
			return res.status(200).json({ msg: "Email already confirmed" });
		}
		// update user details
		await User.findByIdAndUpdate(user._id, { confirmed: true, link: null });
		// return
		return res
			.status(200)
			.json({ msg: messages.emailConfirmationSuccess(user.username) });
	} catch (err) {
		return res.status(500).json({ err: "Server error" });
	}
});

router.post("/login", async (req, res) => {
	// take user input
	const { email, password } = req.body;
	const { errors, valid } = validateLogin(email, password);
	if (!valid) {
		return res.status(400).json({ err: errors });
	}
	try {
		// find user inside db
		const user = await User.findOne({ email });
		// no user found
		if (!user) {
			return res.status(400).json({ err: "Youe email isn't registered" });
		}
		// user found but not already confirmed
		if (user && user.confirmed === false) {
			return res.status(400).json({ err: "Please confirm your email" });
		}
		// is the password match?
		const match = await bcrypt.compare(password, user.password);
		// password dont match
		if (!match) {
			return res.status(400).json({ err: "Invalid email and password" });
		}
		// password match. generate token for login
		const token = jwt.sign(
			{
				id: user._id
			},
			SECRET,
			{ expiresIn: "7d" }
		);
		// return token
		return res.status(200).json({ token });
	} catch (err) {
		return res.status(400).json(err);
	}
});

router.post("/reset-password-request", async (req, res) => {
	const email = req.body.email;
	// validate email input
	const { errors, valid } = validateResetPasswordRequest(email);
	if (!valid) {
		return res.status(400).json({ err: errors });
	}
	try {
		const user = await User.findOne({ email });
		if (!user || (user && user.confirmed === false)) {
			return res.status(400).json({ err: "No user found with that email" });
		}

		const token = jwt.sign(
			{
				username: user.username,
				email: user.email
			},
			SECRET,
			{ expiresIn: "7d" }
		);
		await User.findByIdAndUpdate(user._id, { link: token });
		await sendEmail(
			user.email,
			emailTemplates.resetPasswordRequest(user.username, token)
		);
		return res.status(200).json({ msg: messages.resetPassword(user.email) });
	} catch (err) {
		return res.status(500).json({ err });
	}
});
router.put("/reset-password", async (req, res) => {
	const { newPassword, confirmNewPassword, resetPasswordLink } = req.body;
	const { errors, valid } = validateResetPassword(
		newPassword,
		confirmNewPassword
	);
	if (!valid) {
		return res.status(400).json({ err: errors });
	}
	try {
		const user = await User.findOne({ link: resetPasswordLink });
		if (!user) {
			return res.status(400).json({ err: "Invalid Link" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedNewPassword = await bcrypt.hash(newPassword, salt);
		await User.findByIdAndUpdate(user._id, {
			password: hashedNewPassword,
			link: null
		});
		return res.status(200).json({ msg: messages.resetPasswordSuccess });
	} catch (err) {
		return res.status(500).json({ err });
	}
});
// get the login user
router.get("/loginUser", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json({ err: "Something went wrong" });
	}
});
module.exports = router;
