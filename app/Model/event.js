const pathResolver = require(process.env.resolver);
const mongoose = require('mongoose');
const EventSchema = require(pathResolver.dbSchema('event'));
const helpers = require(pathResolver.defaultPath('helpers/aob'));

let Event = mongoose.model('Event', EventSchema);


let eventExists = (parameters, callback) => {
    findEvent(parameters, (err, event)=>{
        callback(event != null);
    });
};

let eventOverlaps = (startDate, location, callback) => {
    Event.where('date.start').equals(startDate).
    where('location.lng').equals(location.lng).
    where('location.lat').equals(location.lat).
    exec((err, event)=>{
        console.log(event);
        if(err) throw Error("DbError: "+err);
        callback(event.length > 0);
    });
}
let findEvent = (parameter, callback) => {
    return Event.findOne(parameter, callback);
};

let createEvent = async (owner, title, details, location, date, callback) => {

    if(!callback)
        callback = ()=>{};
    
        console.log({title, details, location, date});
    Event.create({owner, title, details, location, date}).then(callback);
};

let getEventsByUser = async (userId, order = 'date.asc', callback ) => {
    if(!callback && typeof order == 'function')
        callback = order;
        
    Event.where('owner').equals(userId).exec(callback);
};

let getEvent = async (_id, callback) => {
    findEvent({_id}, callback);
};


module.exports = {
    Event,
    eventExists,
    eventOverlaps,
    createEvent,
    getEventsByUser,
    getEvent,
};  