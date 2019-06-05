$('.chat-head').hide();
$('.messageDiv').hide();
const emailField = $('#email');
	const userNameField = $('#userName');
	const emailError = $('.email-error');
	const userNameError = $('.userName-error');
	const registerBtn = $('#registerBtn');
	const overlay = $('.overlay');

$(document).ready( () => {
	
	const chatRedirectForm = $("#chatRedirectForm");
	const token = $('#token');
	
	if(token.val().length) {
		chatRedirectForm.submit();
	};
const socket = io.connect('http://localhost:3000');
	
	
	$('#loginForm').on('submit', (e) => {
		alert("here")
	e.preventDefault();
	const mailOrName = $('#mailOrName').val();
	const password = $('#loginPassword').val();
	$('.overlay').show();
	$.ajax({
		url : 'http://localhost:3000/users/login',
		method : 'POST',
		data : {mailOrName, password},
		success : (loginResults) => {
			$('.login-head').hide();
			console.log("loginResults",loginResults)
			data = loginResults.loginResults;
			
			$('.overlay').hide();
			$('#token').val(data.token);
			sessionStorage.setItem('token', data.token);
			$('#userNameHidden').val(data.userName);
			$('#nameHidden').val(data.name);
			$('#loginForm').hide();
			$('#registerForm').hide();
			$('.chat-head').show();
			$('.messageDiv').show();
			//neew user event
			socket.emit('new user', {userName :$('#userNameHidden').val()}, (data) => {
				
					console.log(data);
			});

			socket.on('get usernames', (data) => {
		
				let html = '';
				console.log("dat>>>>",data)
				data.forEach( (user) => {
					html+= `<div class='li-class'> <li>${user}</li></div>`
				});
				$('.online-users').html(html);
			})
		},
		error : (err) => {
			$('.overlay').hide();
			console.log(err);
		}
	});

	
	$('.messageForm').on('submit', (e) => {
		e.preventDefault();
		const messageVal = $('#message').val();
	const userName = $('#userNameHidden').val();
		console.log(messageVal,userName);
		socket.emit('new message', {messageVal, userName});
		const message = $('#message').val('');
	})

	socket.on('send message', (data) => {
			console.log(data);
			const html = "<div class='message'><p><b>"+data.userName+"</b> : "+data.messageVal+"</p></div>";
			$('.message-area').append(html)

	
	})

});


});





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
		});
	}


