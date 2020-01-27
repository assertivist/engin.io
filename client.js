var canvas = document.getElementById("mainCanvas");

var resize_callback = () => {
	var c = document.getElementById("mainCanvas");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
}

resize_callback();
window.onresize = resize_callback;

var socket = io.connect();
socket.on("test", (data)=>{
	console.log(data);
});