'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    $scope.invitedPerson = '';

    $scope.invitedPersonAlready = false;

    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    $scope.invite = function() {
        if(!$scope.invitedPerson || !$scope.invitedPerson.length) {
            alert('No person to invite');
            return;
        }
        if(!validateEmail($scope.invitedPerson)) {
            alert('Please enter a valid email address');
            return;
        }

        $scope.invitedPersonAlready = true;
        REST.inviteFriend($scope.invitedPerson);
    }
}]);
