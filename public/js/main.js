// $('.chat-head').hide();
$('.messageDiv').hide();
var socket='';
socket = io.connect('https://chatapp-anshul.herokuapp.com');


$(document).ready( () => {
	
	const chatRedirectForm = $("#chatRedirectForm");
	const token = $('#token');
	
	if(token.val().length) {
		chatRedirectForm.submit();
	};

	
	
	$('#loginForm').on('submit', (e) => {
		
			e.preventDefault();
			let mailOrName = $('#mailOrName').val();
			let password = $('#loginPassword').val();
			$('.overlay').show();
			$.ajax({
				url : 'https://chatapp-anshul.herokuapp.com/users/login',
				method : 'POST',
				data : {mailOrName, password},
				success : (loginResults) => {
					$('.login-head').hide();
					console.log("loginResults",loginResults)
					data = loginResults.loginResults;
					if(data.status===200) {
						$('.overlay').hide();
						$('.nav-tabs').hide();
						$('#token').val(data.token);
						sessionStorage.setItem('token', data.token);
						$('#userNameHidden').val(data.userName);
						$('#nameHidden').val(data.name);
						$('#loginForm').hide();
						$('#registerForm').hide();
						$('.chat-head').show();
						$('.messageDiv').show();
						$(".online-users").show();
						//neew user event
						 
						socket.emit('new user', {userName :$('#userNameHidden').val()}, (data) => {
							
								console.log(data);
						});

						socket.on('get usernames', (data) => {
					
							let html = '';
							console.log("dat>>>>",data)
							data.forEach( (user) => {
								html+= `<div class='li-class'> <li><h4> <b>@</b> ${user}</li></div>`
							});
							$('.online-users').html(html);
						})
					}
					else {
						$('.overlay').hide();
						$('.login-error').show();
						$('.login-error').html(`<p>${data.message}</p>`)
						return false;
					}
				},
				error : (err) => {
					$('.overlay').hide();
					$('.login-error').show();
					$('.login-error').html(`<p>${data.message}</p>`)
					console.log(err);
				}
	});
});


	$('#registerForm').on('submit', (e) => {
			e.preventDefault();
			
			let email = $('#email').val();
			let password = $('#password').val();
			let fName = $('#fName').val();
			let lName = $('#lName').val();
			let userName = $('#userName').val();
			$('.overlay').show();
			$.ajax({
				url : 'https://chatapp-anshul.herokuapp.com/users/register',
				method : 'POST',
				data : {email, userName, password, fName, lName},
				success : (results) => {
					$('.login-head').hide();
					console.log("results",results)
					data = results.results;
					if(data.status===200) {
						$('.overlay').hide();
						$('.nav-tabs').hide();
						$('#token').val(data.token);
						sessionStorage.setItem('token', data.token);
						$('#userNameHidden').val(data.userName);
						$('#nameHidden').val(data.name);
						$('#loginForm').hide();
						$('#registerForm').hide();
						$('.chat-head').show();
						$('.messageDiv').show();
						$(".online-users").show();
						//neew user event

						socket.emit('new user', {userName :$('#userNameHidden').val()}, (data) => {
							
								console.log(data);
						});

						socket.on('get usernames', (data) => {
					
							let html = '';
							console.log("dat>>>>",data)
							data.forEach( (user) => {
								html+= `<div class='li-class'> <li><h4> <b>@</b> ${user}</li></div>`
							});
							$('.online-users').html(html);
						})
					}
					else {
						$('.overlay').hide();
						$('.login-error').show();
						$('.login-error').html(`<p>${data.message}</p>`)
						return false;
					}
				},
				error : (err) => {
					$('.overlay').hide();
					$('.login-error').show();
					$('.login-error').html(`<p>${data.message}</p>`)
					console.log(err);
					return false;
				}
	})
});

	
	$('.messageForm').on('submit', (e) => {
		e.preventDefault();
		
		const messageVal = $('#message').val();
		const userName = $('#userNameHidden').val();
		if($('#message').val().length === 0) {
				alert("Message cannot be empty");
				return;
		}
		console.log("herhe message",messageVal,userName);
		socket.emit('new message', {messageVal, userName});
		$('#message').val('');
	});

	$('#emoticonForm').on('submit', (e) => {
		e.preventDefault();
		let emoticon = $('#emotionSuggest').val();
		let userName = $('#userNameHidden').val();
		if($('#emotionSuggest').val().length === 0) {
				alert("Message cannot be empty");
				return;
			}
		console.log("emotivon>>>", userName, emoticon)
		socket.emit('new message', {userName, emoticon});
		$('#emotionSuggest').val('');
		$('#emoticonForm').hide("300");
	});

	$('.gif-suggest').on('click', (e) => {
		e.preventDefault();
		let imgSrc = e.target.src;
		let userName = $('#userNameHidden').val();
		if(imgSrc.length) {
			socket.emit('new img message', {userName, imgSrc});
		}
		else {
			return;
		}
	});

	socket.on('new img message', (data) => {
		if(data.userName === $('#userNameHidden').val() ){
				className = "class-right";
			} else {
				className = "class-left"
			}
			if(data.imgSrc) {
			html = `<div class='message col-md-12'>
								<p class='${className}'>
									<b><span class='message-username col-md-12'> 
											${data.userName} : 
									</span></b> 
									<span class="col-md-12"> 
										<img src=${data.imgSrc} class="message-gif img" height='120' width='140'
									<span></p></div><br>`;
			$('.message-area').append(html);
			$('.gif-suggestion').hide("300");
		}
	})

	socket.on('send message', (data) => {
			console.log(data);
			let className="";
			let emoticon = "";
			if(data.userName === $('#userNameHidden').val() ){
				className = "class-right";
			} else {
				className = "class-left"
			}

			if(data.messageVal) {
			const html = `<div class='message col-md-12'><p class='${className}'><b><span class='message-username col-md-12'> ${data.userName} : </span></b> <span class="col-md-12">  ${data.messageVal}</span></p></div><br>`;
			$('.message-area').append(html);
		}
		if(data.sentiScore!=null || data.sentiScore!=undefined) {
				$('#emoticonForm').show("300");
				$('.gif-suggestion').show();

				if(data.sentiScore >0){
					emoticon = ":)";
					$(".emotionSuggest").val(emoticon);
					$('#img1').attr('src', '/assets/img/happy.gif');
					$('#img2').attr('src', '/assets/img/happy2.gif');
					$('#img3').attr('src', '/assets/img/happy3.gif');
				}
				else if(data.sentiScore<0) {
						emoticon = ":(";
						$(".emotionSuggest").val(emoticon);
						$('#img1').attr('src', '/assets/img/sad.gif');
						$('#img2').attr('src', '/assets/img/sad2.gif');
						$('#img3').attr('src', '/assets/img/sad3.gif');

				}
				else {
					emoticon = ":|";
					$('.emotionSuggest').val(emoticon);
					$('#img1').attr('src', '/assets/img/neutral.gif');
					$('#img2').attr('src', '/assets/img/nuetral2.gif');;
					$('#img3').attr('src', '/assets/img/nuetral3.gif');;
				}
			}	
		if(data.emoticon) {
			html = `<div class='message col-md-12'><p class='${className}'><b><span class='message-username col-md-12'> ${data.userName} : </span></b> <span class="col-md-12 message-emoticon"> ${data.emoticon}<span></p></div><br>`;
			$('.message-area').append(html);

		}	
	})

});




const emailField = $('#email');
	const userNameField = $('#userName');
	const emailError = $('.email-error');
	const userNameError = $('.userName-error');
	const registerBtn = $('#registerBtn');
	const overlay = $('.overlay');
	



const checkEmail = () => {
		
		let email = $('#email').val();
		
		if(email.length <= 2)
			return;
		$('.overlay').show();
		$.ajax({
			'url' : 'https://chatapp-anshul.herokuapp.com/users/checkMail',
			'data' : {email},
			'method' : 'POST',
			'success' : (data) => {
				console.log("data",data)
				$('.overlay').hide();
				if(data.userExist === false) {
					$('.email-error').html('<p class="text-success email-res">Email available! Good to go.</p>');
					$('#registerBtn').attr('disabled', false);

				} else {
					$('.email-error').html('<p class="text-danger email-res">Email already taken. Please try another one.</p>');
					$('#registerBtn').attr('disabled', true);
				}
			},
			'error' : (err) => {
				$('.overlay').hide();
				console.log(err);
			},
		})
	};

	const checkUserName = () => {
		let userName = $('#userName').val();
		if(userName.length <= 2)
			return;
		$('.overlay').show();
		$.ajax({
			'url' : 'https://chatapp-anshul.herokuapp.com/users/checkName',
			'data' : {userName},
			'method' : 'POST',
			'success' : (data) => {
				console.log("data",data)
				$('.overlay').hide();
				if(data.userExist === false) {
					$('.userName-error').html('<p class="text-success email-res">User name available! Good to go.</p>');
					$('#registerBtn').attr('disabled', false);

				} else {
					$('.userName-error').html('<p class="text-danger email-res">User name already taken. Please try another one.</p>');
					$('#registerBtn').attr('disabled', true);

				}
			},
			'error' : (err) => {
				$('.overlay').hide();
				console.log(err);
			},
		});
	}


