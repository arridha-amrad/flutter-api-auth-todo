const { CLIENT_ORIGIN } = require("../config");

module.exports = {
	emailConfirmation: (username, link) => ({
		subject: "Flutter-API-Auth-Todo - Email confirmation",
		text: `Please use the following link to confirm your email addresss: ${CLIENT_ORIGIN}/confirm/${link}`,
		html: `<h2 style={{color: "#eee"}}>Hello ${username}</h2><p>Please use the following link to confirm your email:</p> <p>${CLIENT_ORIGIN}/confirm/${link}</p> <p>If you didn’t ask to confirm your email, you can ignore this email.
    </p> <p>Thanks</p>`
	}),
	resetPasswordRequest: (username, token) => ({
		subject: "Flutter-API-Auth-Todo- Password Reset Instructions",
		text: `Please use the following link to reset your password: ${CLIENT_ORIGIN}/reset-password/${token}`,
		html: `<p>Hello ${username}</p><p>Please use the following link to reset your password:</p> <p>${CLIENT_ORIGIN}/reset-password/${token}</p> <p>If you didn’t ask to reset your password, you can ignore this email.
    </p> <p>Thanks</p>`
	})
};
