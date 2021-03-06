/**
 * Created with IntelliJ IDEA.
 * User: kirisu
 * Date: 5/18/13
 * Time: 2:41 PM
 * Generate test mood data.
 */
var moods = [
    "inspired",
    "alert",
    "excited",
    "enthusiastic",
    "determined"
];

var users = [
    "chrislim",
    "dchang",
    "garylengkong",
    "dokku1230"
];

var howManyEvents = 10;
var generateTimestamps = function () {
    var now = (new Date()).getTime();
    var interval = 1000 * 60 * 60 * 3;
    var results = [];
    for (i = 0; i < howManyEvents; i++) {
        results.push(now + i * interval);
    }
    return results;
};

var timestamps = generateTimestamps(howManyEvents);

var randomNumber = function (min, max) {
    return (Math.floor(Math.random() * max) + min);
};

var generateMood = function () {
    var mood = {};
    moods.forEach(function (m) {
        mood[m] = randomNumber(1, 5);
    });
    return mood;
};

var generateExplanation = function () {
    var positive = [
        "great day at work",
        "got alot done",
        "hot date tonight",
        "great time praying"
    ];
    var negative = [
        "had to work late today",
        "sick",
        "dreams just died",
        "nice day"
    ];
    if (randomNumber(0, 1)) {
        return positive[randomNumber(1, 4)];
    } else {
        return negative[randomNumber(1, 4)];
    }
};

var generateTestData = function () {
    var testData = [];
    timestamps.forEach(function (t) {
        testData.push({"ts": t, "data": {moods: generateMood(), explanation: generateExplanation()}});
    });
    return testData;
};

var completeTestData = users.map(function(u){
    return {username: u, data: generateTestData()};
});

console.log(completeTestData);

// calculate the average of a particular mood inside a time window
var averageMood = function(data, mood){
    var average = 0;
    data.forEach(function(d){
        average += d.data.moods[mood];
    });
    return average / data.length;
};

// calculate the overall mood for a specific data point
// assumes positive affect only
var overallMood = function(moods){
    var overall = 0;
    var i = 0;
    for(m in moods){
        if(moods.hasOwnProperty(m)){
            overall += moods[m];
            i++;
        }
    }
    return overall / i;
};

// now insert this data structure into redis by hitting the REST url exposed by express.
