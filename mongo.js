var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', function callback () {
      // yay!
});

var moodSchema = mongoose.Schema({
    userId: String,
    date: { type: Date, default: Date.now },
    mood: {
        type: String,
        value: Number
    }
});

var Mood = mongoose.model('Mood', moodSchema);

var eventSchema = mongoose.Schema({
    userId: String,
    date: { type: Date, default: Date.now },
    text: String
});

var Event = mongoose.model('Event', eventSchema);

module.exports = {
    Mood: Mood,
    Event: Event
}
