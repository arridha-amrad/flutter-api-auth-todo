const nodemailer = require("nodemailer");

const credentials = {
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {
		user: "arridhaamrad@gmail.com",
		pass: "fababykukyhkffwx"
	}
};

const transporter = nodemailer.createTransport(credentials);
module.exports = async (to, content) => {
	const contacts = {
		from: "arridhaamrad@gmail.com",
		to
	};
	const email = Object.assign({}, content, contacts);
	await transporter.sendMail(email);
};
