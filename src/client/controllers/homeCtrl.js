angular.module('mealplanner')

  .controller('homeCtrl', function($scope, checkUser) {
    $scope.user = checkUser;
  });
