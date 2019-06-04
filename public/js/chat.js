//$(document).ready( () => {
	const socket = io.connect('http://localhost:3000');

	const userNameField = $('#userName');
	const fullNameField = $('#fullName');
	const pageVisits = $('#pageVisits');
	alert(pageVisits.val());
	if(pageVisits.val() == 0) {
		socket.emit('new user', {userName :userNameField.val(), pageVisits : pageVisits.val()}, (data) => {
			//alert(pageVisits.val());
			console.log(data);
			if(data.status)
				pageVisits.val(data.pageVisits);
		});

		socket.on('get usernames', (data) => {
				const onlineUsers = $('.online-users');
				let html = '';
				data.forEach( (user) => {
					 html+= `<li>${user.userName}</li>`;
				});
				onlineUsers.html(html);
		});
	}
//});