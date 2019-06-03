$(document).ready( () => {
	const chatRedirectForm = $("#chatRedirectForm");
	const token = $('#token');

	if(token.val().length) {
		chatRedirectForm.submit();
	} 
});

const emailField = $('#email');
	const userNameField = $('#userName');
	const emailError = $('.email-error');
	const userNameError = $('.userName-error');
	const registerBtn = $('#registerBtn');
	const overlay = $('.overlay');

const checkEmail = () => {
		let email = emailField.val();
		if(email.length <= 2)
			return;
		overlay.show();
		$.ajax({
			'url' : 'http://localhost:3000/users/checkMail',
			'data' : {email},
			'method' : 'POST',
			'success' : (data) => {
				console.log("data",data)
				overlay.hide();
				if(data.userExist === false) {
					emailError.html('<p class="text-success email-res">Email available! Good to go.</p>');
					registerBtn.attr('disabled', false);

				} else {
					emailError.html('<p class="text-danger email-res">Email already taken. Please try another one.</p>');
					registerBtn.attr('disabled', true);
				}
			},
			'error' : (err) => {
				overlay.hide();
				console.log(err);
			},
		})
	};

	const checkUserName = () => {
		let userName = userNameField.val();
		if(userName.length <= 2)
			return;
		overlay.show();
		$.ajax({
			'url' : 'http://localhost:3000/users/checkName',
			'data' : {userName},
			'method' : 'POST',
			'success' : (data) => {
				console.log("data",data)
				overlay.hide();
				if(data.userExist === false) {
					userNameError.html('<p class="text-success email-res">User name available! Good to go.</p>');
					registerBtn.attr('disabled', false);

				} else {
					userNameError.html('<p class="text-danger email-res">User name already taken. Please try another one.</p>');
					registerBtn.attr('disabled', true);
				}
			},
			'error' : (err) => {
				overlay.hide();
				console.log(err);
			},
		})
	}
