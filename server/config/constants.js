function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("ADMIN_FEE", 0.15);
define("UTC_OFFSET", 7*3600*1000);