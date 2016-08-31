angular.module('mealplanner')
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: './views/login.html',
      controller: 'loginCtrl'
    }).state('home', {
      url: '/home',
      templateUrl: './views/home.html',
      controller: 'homeCtrl'
    });;

    $urlRouterProvider.otherwise('/');
  })
