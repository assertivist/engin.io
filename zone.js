const
    Rect = require("./rect");
    Vec2 = require("./vec2");


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
                [x - rect.width, y + rect.height], // NW
                [x, y + rect.height], // N
                [x + rect.width, y + rect.height], // NE
                [x, y - rect.height], // S
                [x + rect.width, y], // E
                [x - rect.width, y], // W 
                [x - rect.width, y - rect.height], // SW
                [x + rect.width, y - rect.height] // SE
            ];
        //console.info(points);
        return _.compact(_.map(points, (vec) => { 
            return this.locate_from_bottom(new Vec2(vec[0], vec[1])); 
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

module.exports = Zone;