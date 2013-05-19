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

    this.getMood = function(callback) {
        $http.get('/mood/')
            .then(function(res) {
                callback(res);
            });
    };

    this.inviteFriend = function(invitedPerson, callback) {
        $http.post('/friend/', { email: $scope.invitedPerson })
            .then(function(res){
                callback && callback(res.data !== 'OK', res);
            });
    }
}
]);
