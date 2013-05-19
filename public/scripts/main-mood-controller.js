'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    var defaultScales = [
        {type: 'Excited', value: 3},
        {type: 'Determined', value: 3},
        {type: 'Inspired', value: 3},
        {type: 'Alert', value: 3},
        {type: 'Enthusiastic', value: 3},
    ];

    var savedMetrics = JSON.parse(ls.get('metrics'));
    $scope.scales = savedMetrics && savedMetrics.length ? savedMetrics[savedMetrics.length - 1] : defaultScales;

    function generateResponse() {
        var sum = 0;
        for(var i = 0, len = $scope.scales.length; i < len; ++i) {
            sum += parseInt($scope.scales[i].value);
        }

        var responses=[
            'I hope you start feeling better!',
            'That\'s a tough spot to be in...',
            'Funny, I didn\'t realize it was Monday',
            'That\'s what I\'m talking about!',
            'High five! You got it!'
        ];

        var moodIndex = parseInt((sum - 3) / 5);

        $scope.imgUrl = '/img/dog' + moodIndex + '.jpg';
        $scope.responseText = responses[moodIndex];
    }

    $scope.alreadySetTheirMood = false;

    generateResponse();

    $scope.saveInputs = function() {

        var metrics = JSON.parse(ls.get('metrics')) || [];
        metrics.push($scope.scales);
        ls.add('metrics', JSON.stringify(metrics));

        REST.saveMood($scope.scales);

        generateResponse();

        $scope.alreadySetTheirMood = true;
    }

    $scope.description = '';
    $scope.saveText = function() {

        if($scope.description == 'clear') {
            ls.clearAll();
            return;
        }

        if(!$scope.description || !$scope.description.length) {
            alert('No Description');
            return;
        }

        var descriptions = JSON.parse(ls.get('descriptions')) || [];
        descriptions.push($scope.description);
        ls.add('descriptions', JSON.stringify(descriptions));

        REST.saveEvent($scope.description);
    }
}]);
