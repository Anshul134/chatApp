$(document).ready( () => {
	const socket = io.connect('http://localhost:3000');

	const myName = $('#userName').val();
	const fullName = $('#fullName').val();
	
	socket.emit('user authed', {userName : myName, fullName: fullName}, (data) => {
		if(data) {
			$('.chat-wrap').show();
		}
		else {
			alert("err");
		}
	});

	socket.on('get usernames', (data, callback) => {
		
		var html = '';
		data.forEach( (user) => {
			html += `<a href="" class="links" data-key=${user.userName}>
						<div class="cards" >
							<div class="names">
								<h4>@ ${user.userName}</h4>
								<p class="user-fullname">${user.fullName}</p>
							</div>
						</div>
						</a>`
		});
		$(".chat-head").html(html);
	});

	$('.chat-name-wrap').on('click', 'links', (e) => {
		e.preventDefault();
		alert(this.data('key'));
	})
});