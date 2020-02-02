var hash = "browns";
var rand_calls = 0;

function xfnv1a(str) {
    for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
        // Math.imul() allows for 32-bit integer multiplication with C-like semantics
        h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }

    return function() {
        h += h << 13;
        h ^= h >>> 7;
        h += h << 3;
        h ^= h >>> 17;
        return (h += h << 5) >>> 0;
    };
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

var rand = () => { 
    rand_calls = rand_calls + 1;
    let 
        h = hash + rand_calls;
        s = xfnv1a(h)();
    return sfc32(s, s, s, s)();
}

module.exports = rand;