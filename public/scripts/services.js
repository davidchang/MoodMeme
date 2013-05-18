'use strict';

App.service('REST', ['$http', function($http) {

    this.saveMood = function(mood, callback) {
        $http.post('/mood/', { mood : JSON.stringify(mood) })
            .then(function(res){
                callback && callback(res.data !== 'OK', res);
            });
    }

    this.saveEvent = function(moodEvent, callback) {
        $http.post('/moodEvent/', { moodEvent : JSON.stringify(moodEvent) })
            .then(function(res){
                callback && callback(res.data !== 'OK', res);
            });
    }

    //just an example GET api
    this.getExample = function(callback) {
        $http.get('/example/')
            .then(function(res) {
                callback(res);
            });
    };
}
]);
