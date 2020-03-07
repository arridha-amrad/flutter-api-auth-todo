module.exports.validateSignup = (username, email, password) => {
	const errors = {};
	if (username.trim() === "") {
		errors.username = "Username is required";
	} else if (username.length <= 5) {
		errors.username = "Username is too short";
	}
	if (email.trim() === "") {
		errors.email = "Email is required";
	} else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = "Email is not valid";
		}
	}
	if (password.trim() === "") {
		errors.password = "Password is required";
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateLogin = (email, password) => {
	const errors = {};
	if (email.trim() === "") {
		errors.email = "Email is required";
	}
	if (password.trim() === "") {
		errors.password = "Password is required";
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateResetPasswordRequest = email => {
	const errors = {};
	if (email.trim() === "") {
		errors.email = "Email is required";
	} else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = "Email is not valid";
		}
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateResetPassword = (newPassword, confirmNewPassword) => {
	const errors = {};
	if (newPassword.trim() === "") {
		errors.newPassword = "Password is required";
	}
	if (newPassword !== confirmNewPassword) {
		errors.newPassword = "Password doesn't match";
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};
