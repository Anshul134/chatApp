$(document).ready( () => {
	const socket = io.connect('http://localhost:3000');
	const btn = $('#btn');
	const output = $('.output');
	const message = $('#message');
	const handle = $('#handle');
	const feedback = $("#feedback");
	btn.on('click', () => {
		
	let msg = message.val();
	let name = handle.val();

	socket.emit('chat', 
			{msg, name}
		);
	});

	message.on('keypress', () => {
		socket.emit('typing', {
			handle:handle.val(),
		})
	});


	socket.on('chat', (data) => {
		feedback.html('');
		output.html( output.html() + data.name + " : " + `<p>${data.msg}</p>`);
	});

	socket.on('typing', (data) => {
		feedback.html(`${data.handle} is typing...`);
	});
});