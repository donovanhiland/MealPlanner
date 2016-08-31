angular.module('mealplanner')

  .controller('loginCtrl', function($scope) {

    $('.view-container').height($(window).height() - $('.header').height());
    console.log($('.view-container').height());

  });
