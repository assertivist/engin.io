const
    app = require('express')();
    http = require('http').createServer(app);
    io = require("socket.io")(http);
    fs = require("fs");
    redis = require("redis");
    db = redis.createClient();
    _ = require("underscore-node");
    moment = require("moment");
    rand = require("./rand");
    Rect = require("./rect");
    Zone = require("./zone");

let 
    clients = new Map();

app.get('/', function(req, res) {
    log_hit(req);
    res.sendFile(__dirname + "/index.html");
});

app.get("/client.js", function(req, res) {
    res.sendFile(__dirname + "/client.js");
});

http.listen(3230);

db.on("error", console.log);

var enc = JSON.stringify;

var save_object = (key, object) => { db.set(key, enc(object)); }
var now = () => { return moment().valueOf(); }

function Client(socket) {
    this.sock = socket;
    this.id = socket.id;
    this.name = "";
    this.address = socket.handshake.address;

    socket.on("name", (data) => {
        this.name = data.new_name;
    });

}

function World() {
    this.size = 10000;
    this.bounds = new Rect(new Vec2(-this.size, -this.size), 
                           new Vec2(this.size, this.size));
    this.zone_size = 1000;
    this.zone_r = Math.floor(this.bounds.x / this.zone_size);
    this.zone_root = Zone(this.bounds, true);

    this.get_zone_count = () => {
        return this.zone_root.count();
    }

    this.get_spawn = () => {
        return 
    }
    
}

function Player(client) {
    this.client = client;
}

function log_hit(req) {
    var record = {
        agent: req.get("user-agent"),
        accessed: now(),
        ip: req.ip
    }
    console.info(record);
    db.lpush("hit", enc(record));
}


io.on("connection", (socket) => {
    console.info("Client connected [id="+socket.id+"}]");
    clients.set(socket, new Client(socket));
});

w = new World();
console.info(w.zone_root.count())

mainloop = setInterval(() => {

}, 0);
