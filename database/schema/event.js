const resolver = require(process.env.resolver);
var mongoose = require(resolver.connection());
var lastUpdateDate = require('./plugins/last-update');
var createdDate = require('./plugins/created-at');
var Schema = mongoose.Schema;

// sample for a event schema
var structure = {};
structure.owner = String;
structure.title = String;
structure.details = String;
structure.location = {
    lat: Number,
    lng: Number,
    name: String
};

structure.date = {
    start: Date,
    end: Date
};

var eventSchema = new Schema(structure);

eventSchema.plugin(lastUpdateDate);
eventSchema.plugin(createdDate);

module.exports = eventSchema;