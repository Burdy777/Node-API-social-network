const jwt = require('jsonwebtoken');
TOKEN_SECRET = 'Jjhdizjdjfjjfejjejejejejennenefnefefie22??izjidjzdu877G7bèB7';
module.exports = {
generateToken: function(userData) {
    return jwt.sign({
        userId: userData.id,
        isAdmin: 0
    }, TOKEN_SECRET, {expiresIn: '1h'})
}
}