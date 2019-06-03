$(document).ready( () => {
	const socket = io.connect('http://localhost:3000');

	const myName = $('#myUserName').val();
	socket.emit('user authed', {userName : myName}, (data) => {
		if(data) {
			$('.chat-wrap').show();
		}
		else {
			alert("err");
		}
	});
});