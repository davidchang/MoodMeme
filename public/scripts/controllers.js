'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', function($scope, ls) {
    var defaultScales = [
        {text: 'Inspired', value: 3},
        {text: 'Excited', value: 3},
        {text: 'Determined', value: 3}
    ];

    var savedMetrics = JSON.parse(ls.get('metrics'));
    $scope.scales = savedMetrics && savedMetrics.length ? savedMetrics[savedMetrics.length - 1] : defaultScales;

    $scope.saveInputs = function() {

        var metrics = JSON.parse(ls.get('metrics')) || [];
        metrics.push($scope.scales);
        ls.add('metrics', JSON.stringify(metrics));

        console.log('saved metrics:');
        console.log(metrics);
    }

    $scope.description = '';
    $scope.saveText = function() {

        if(!$scope.description || !$scope.description.length)
            return;

        var descriptions = JSON.parse(ls.get('descriptions')) || [];
        descriptions.push($scope.description);
        ls.add('descriptions', JSON.stringify(descriptions));

        console.log('saved descriptions:');
        console.log(descriptions);
    }
}]);
