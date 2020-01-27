const
    app = require('express')();
    http = require('http').createServer(app);
    io = require("socket.io")(http);
    fs = require("fs");
    redis = require("redis");
    db = redis.createClient();
    _ = require("underscore-node");
    moment = require("moment");
    Rect = require("./rect");
    Vec2 = require("./vec2");

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

var save_object = (key, object) => {
    db.set(key, enc(object));
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

var now = () => { return moment().valueOf(); }
var seed = 2314234;
var start = now();
var rand_calls = 0;

var rand = () => {
    var s = now() - start;
    rand_calls += 1;
    console.info("s: " + s);
    return sfc32(seed,
                 seed << 2,
                 rand_calls, 
                 s)();
}


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

function Zone(rect, is_root, number, parent) {
    this.is_root = is_root;
    this.number = number;
    this.rect = rect;
    this.parent = parent;
    var min = rect.min;
    var max = rect.max;
    mid_x = min.x + (rect.width * .5);
    mid_y = min.y + (rect.height * .5);
    var half_max = new Vec2(min.x + rect.width * .5, min.y + rect.height * .5);
    
    this.get_id = () => {
        if(!this.is_root && this.parent) {
            return this.parent.get_id() + "" + this.number
        }
        return "";
    };



    this.id = this.get_id();

    this.locate = (point) => {
        var inside = this.is_root || this.rect.contains(point);
        if (!inside) return false;
        if (inside && this.leaf) {
            return this;
        }
        return _.last(_.compact(_.flatten(
                [this.number, 
                 _.compact(_.flatten(
                    _.map(this.children, (child, i) => { 
                        return child.locate(point); 
               })))])));
    };

    this.locate_from_bottom = (point) => {
        if(this.parent) { return this.parent.locate_from_bottom(point)}
        else{ return this.locate(point) }
    }

    this.leaves = () => {
        if (this.leaf) return this;
        return _.flatten(_.map(this.children, (child) => { 
            return child.leaves()}));
    }

    this.count = () => {
        if(this.leaf) return 1;
        else return _.reduce(_.map(this.children, (child) => {
            return child.count();
        }), (a, b) => { return a + b; }, 0);
    };

    this.neighbors = () => {
        if (!this.leaf) return _.compact(_.map(this.children, (child) => { return child.neighbors() }));
        x = this.center.x;
        y = this.center.y;
        //console.info(this.center);
        var points = [
                new Vec2(x - rect.width, y + rect.height), // NW
                new Vec2(x, y + rect.height), // N
                new Vec2(x + rect.width, y + rect.height), // NE
                new Vec2(x, y - rect.height), // S
                new Vec2(x + rect.width, y), // E
                new Vec2(x - rect.width, y), // W 
                new Vec2(x - rect.width, y - rect.height), // SW
                new Vec2(x + rect.width, y - rect.height) // SE
            ];
        //console.info(points);
        return _.compact(_.map(points, (vec) => { 
            return this.locate_from_bottom(vec); 
        }));
    };

    if (rect.width < 1000) {
        this.leaf = true;
        this.center = rect.getCenter();
    }
    else {
        this.leaf = false;
        //  0 | 1
        //  -----
        //  2 | 3

        var subdiv = [
            [min, half_max],
            [new Vec2(mid_x, min.y),
             new Vec2(max.x, mid_y)],
            [new Vec2(min.x, mid_y),
             new Vec2(mid_x, max.y)],
            [half_max, max]
        ];

        this.children = _.map(subdiv, (vec, i) => {
            return new Zone(new Rect(vec[0], vec[1]), false, i, this);
        });
    }
    
    return this;
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

const worldinitstart = now();
w = new World();
const worldinitend = now();
console.info("Setup everything in " + (worldinitend - worldinitstart) + " things");
//var thing = w.zone_root.locate(new Vec2(10, 10));
//console.info(thing);
//console.info(_.map(w.zone_root.leaves(), (zone) => { return zone.neighbors()}));
console.info(rand());
console.info(rand());
console.info(rand());

console.info(rand());

console.info(rand());

console.info(rand());

console.info(rand());

console.info(rand());
mainloop = setInterval(() => {

}, 0);
