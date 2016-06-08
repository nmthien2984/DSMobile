(function() {

  angular.module('app.controllers', ["firebase"])
  .controller("productCtrl", ["$scope", "$firebaseArray", "$window", 
  function($scope, $firebaseArray, $window){

    var ref = new Firebase("https://mobileds.firebaseio.com/");
    	
    $scope.phone = Lockr.get("phone", null);
    if (phone != null)
      Lockr.set("reqBrand", $scope.phone.maker.name);

    $scope.products = $firebaseArray(ref.child('products'));
    $scope.products.$loaded()
      .then(function() {
        console.log($scope.products);
      })
      .catch(function(err) {
      console.error(err);
      });

    $scope.loadPhones = function(brand) {
      Lockr.set("phone", null);
      Lockr.set("reqBrand", brand);
      $window.location.href = "/";
    };

  }]);
})();