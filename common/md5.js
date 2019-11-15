
const crypto = require('crypto');
function f(txt) {
    const hash = crypto.createHash('md5');
    return hash.update(txt).digest('hex');
}
module.exports = f;