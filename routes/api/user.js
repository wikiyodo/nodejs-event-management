var express = require('express');
const pathResolver = require(process.env.resolver);
const EventController = require(pathResolver.controllers('event-controller'));
const AuthMiddleWare = require(pathResolver.middleware('authMiddleware'));
var router = express.Router();
var $ = pathResolver.parser;


router.use($('api.event.root', 'api'), AuthMiddleWare);
router.post($('api.event.create', 'api'), EventController.create);
router.get($('api.event.get.all', 'api'), EventController.getMyEvents);
router.get($('api.event.get.id', 'api'), EventController.getMyEventDetails);

module.exports = router;