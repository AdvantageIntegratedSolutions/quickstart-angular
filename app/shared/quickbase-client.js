var app = require('../../config/app.config.js');
var quickbase = require('../../config/quickbase.config.js');

const db = new Base(quickbase);
window.db = db;

BaseHelpers.options.timeZone = app.timezone;

export default db;