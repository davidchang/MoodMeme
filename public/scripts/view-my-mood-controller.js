'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    REST.getMood(function(response) {
        var toSet = [];

        var data = response.data;
        console.log(data);

        for(var i = 0, len = data.length; i < len; ++i) {
            var curMoodTypes = data[i].mood;

            toSet.push(JSON.parse(curMoodTypes));
        }
        console.log(toSet);

        $scope.moodData = toSet;
    });
}]);
