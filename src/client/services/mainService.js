angular.module('mealplanner')
  .service('mainService', function($http) {
      this.checkUser = () => {
        return $http({
          method: 'GET',
          url: '/me'
        }, response => {
          return response.data
        })
      }
  });
