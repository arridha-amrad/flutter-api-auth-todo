module.exports = {
	confirm: email =>
		`An email confirmation has been sent to ${email}, please follow the instruction`,
	emailConfirmationSuccess: username =>
		`Welcome ${username}!. Your registration is sucessfull. Please login`,
	resetPassword: email =>
		`An email has been sent to ${email}. Follow the instructions to reset your password.`,
	resetPasswordSuccess: "You can login with your new password"
};
