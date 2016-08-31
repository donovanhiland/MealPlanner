angular.module('mealplanner')

  .controller('mainCtrl', function($scope) {

    $('.view-container').height($(window).height() - $('.header').height());
    console.log($('.view-container').height());

  });
