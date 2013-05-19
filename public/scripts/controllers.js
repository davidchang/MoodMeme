'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    var defaultScales = [
        {text: 'Excited', value: 3},
        {text: 'Determined', value: 3},
        {text: 'Inspired', value: 3},
        {text: 'Alert', value: 3},
        {text: 'Enthusiastic', value: 3},
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
            'Funny, I didn\'t really it was a Monday',
            'That\'s what I\'m talking about!',
            'High five! You got it!'
        ];

        var moodIndex = parseInt((sum - 3) / 5);

        $scope.imgUrl = '/img/dog' + moodIndex + '.jpg';
        $scope.responseText = responses[moodIndex];
        console.log($scope.imgUrl);
    }

    $scope.alreadySetTheirMood = false;

    generateResponse();

    $scope.saveInputs = function() {

        var metrics = JSON.parse(ls.get('metrics')) || [];
        metrics.push($scope.scales);
        ls.add('metrics', JSON.stringify(metrics));

        REST.saveMood($scope.scales);

        console.log('saved metrics:');
        console.log(metrics);

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
        //$scope.description = '';

        console.log('saved descriptions:');
        console.log(descriptions);
    }
}]);
