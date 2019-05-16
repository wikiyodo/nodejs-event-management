// import helpers
const pathResolver = require(process.env.resolver);
const EventModel = require(pathResolver.model('event'));
const Event = EventModel.Event;
const Controller = require('./controller');
var validator = require(pathResolver.validator());

var EventController = {};

EventController.notFound = (req, res, next, message, extras) => {
    res.status = 404;
    Controller.defaultResponse(res,null, message, false);
};

EventController.create = (req, res, next) => {
    // validate the request
    // required: firstname, lastname, email, password
    let {title, details, location, date} = req.body;
    location = location || {};
    date = date || {};
    let {lat, lng, name} = location;
    let {start, end} = date;
    validator([
        {
            fieldName: "event title",	// name of the field
            fieldValue: title, 	// the value of the field
            validation: 'required|string|min:3|max:25', // set of validation rules
        },
        {
            fieldName: "event datails",	// name of the field
            fieldValue: details, 	// the value of the field
            validation: 'required|string|min:3|max:100', // set of validation rules
        },
        {
            fieldName: "event location lat",	// name of the field
            fieldValue: lat, 	// the value of the field
            validation: 'required', // set of validation rules
        },
        {
            fieldName: "event location lng",	// name of the field
            fieldValue: lng, 	// the value of the field
            validation: 'required', // set of validation rules
        },
        {
            fieldName: "event location",	// name of the field
            fieldValue: name, 	// the value of the field
            validation: 'required', // set of validation rules
        },
        {
            fieldName: "event start date",	// name of the field
            fieldValue: start, 	// the value of the field
            validation: 'required', // set of validation rules
        },
        {
            fieldName: "event end date",	// name of the field
            fieldValue: end, 	// the value of the field
            validation: 'required', // set of validation rules
        },
     ], (validation) => {
            if(validation.failed()){
                Controller.error(res,{
                    title: validation.firstError('event title'),
                    details: validation.firstError('event datails'),
                    location: validation.firstError('event location lat') || validation.firstError('event location lng') || validation.firstError('event location'),
                    date: validation.firstError('event start date') || validation.firstError('event end date'),
                }, "Event could not be created. Check fields to fix error");
                return;
            }

            let startDate = new Date(start);
            let endDate = new Date(end);

            // now confirm that the end date is greater than the start date
            if(startDate.getTime() < (new Date()).getTime() || startDate.getTime() > endDate.getTime()){
                Controller.error(res,{
                    date: "Start date cannot be past or the future of end date"    
                }, "Event could not be created. Check fields to fix error");
                return;
            }

            // check if a similar user exists : email must be unique
            // an event is said to exist if there exist an event in the same location
            // and also at the same date

            EventModel.eventOverlaps(start, location, (exists)=>{
                if(exists){
                    Controller.error(res,{
                    }, "An event with same date and location has already been booked!");
                    return;
                }
                console.log(res.locals.user);
                // the validation was successful then create the user account
                EventModel.createEvent(res.locals.user._id, title, details, location, date);
                Controller.success(res, null, "Your event has been created!")
                return;
            });
        });
};

EventController.getMyEvents = (req, res) => {
    let user = res.locals.user;

    // get all events in the ascending order of dates
    EventModel.getEventsByUser(user._id, '', (err, events)=>{
        if(err){
            Controller.error(res,{
            }, "Try again later. Could not fetch events at the moment");
            return;
        }
        Controller.success(res, {events}, "You have "+events.length+" events");
    });
};

EventController.getMyEventDetails = (req, res) => {
    let user = res.locals.user;
    let eventId = req.params.id;
    console.log(req.params);

    // get all events in the ascending order of dates
    EventModel.getEvent(eventId,  (err, event)=>{
        if(err){
            Controller.error(res,{
            }, "Try again later. Could not fetch event at the moment");
            return;
        }
        if(!event){
            Controller.error(res, {}, "This event does not exists");
            return;
        }
        
        Controller.success(res, {event}, "Event fetched");
    });
};



module.exports = EventController;