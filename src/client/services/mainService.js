angular.module('mealplanner')
  .service('mainService', function($http) {

      this.checkUser = () => {
        return $http({
          method: 'GET',
          url: '/me'
        }).then(response => {
          return response.data;
        });
      };

  });// END
