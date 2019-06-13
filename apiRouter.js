// Import
const express = require('express');
const server = express();
const userCtrl = require('./routes/usersCtrl')

// Router
exports.router = (function(){
    const apiRouter = express.Router();
    apiRouter.route('/users/register').post(userCtrl.register);
    apiRouter.route('/users/login').post(userCtrl.login);

    return apiRouter;
})();