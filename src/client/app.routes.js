angular.module('mealplanner')
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: './views/login.html',
      controller: 'loginCtrl',
      resolve: {
        checkUser: (mainService, $state) => {
          return mainService.checkUser().then(response => {
            if(response.data) $state.go('home');
          })
        }
      }
    }).state('home', {
      url: '/home',
      templateUrl: './views/home.html',
      controller: 'homeCtrl',
      resolve: {
        checkUser: (mainService, $state) => {
          return mainService.checkUser().then(response => {
            if(!response.data) $state.go('login');
          })
        }
      }
    });;

    $urlRouterProvider.otherwise('/');
  })
