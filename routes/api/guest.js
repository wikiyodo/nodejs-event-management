var express = require('express');
const pathResolver = require(process.env.resolver);
const UserController = require(pathResolver.controllers('user-controller'));
const TestMiddleWare = require(pathResolver.middleware('wikiMiddleware'));
var router = express.Router();
var $ = pathResolver.parser;
/**
 * User should be able to register, Login, Create event, View Event Calendar, View Event details in modal, 
 */

router.post($('api.user.register', 'api'), UserController.register);
router.post($('api.user.login', 'api'), UserController.login);

module.exports = router;