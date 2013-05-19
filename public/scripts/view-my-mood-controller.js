'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    REST.getMood(function(response) {
        var toSet = [];

        var data = response.data;

        for(var i = 0, len = data.length; i < len; ++i) {
            var curMoodTypes = data[i].mood;

            toSet.push({ mood: JSON.parse(curMoodTypes), time: data[i].date });
        }

        $scope.moodData = toSet;
    });

    REST.getEvents(function(response) {
        var toSet = [];

        console.log(response.data);

        var data = response.data;
        for(var i = 0, len = data.length; i < len; ++i) {
            toSet.push({ moodEvent: data[i].text, time: data[i].date });
        }

        $scope.eventData = toSet;
    });
}]);
